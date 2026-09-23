import { useMemo, useRef, useState } from "react";
import { Check, FileText, Mic, Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense } from "../../api/expenseApi";
import SplitSelector from "./SplitSelector";
import MemberSelector from "./MemberSelector";
import { useAuth } from "../../hooks/useAuth";
import { startSpeechRecognition } from "../../utils/speechRecognition";
import { parseExpenseText } from "../../utils/expenseParser";
import { calculateSplits, validateSplit } from "../../utils/splitCalculations";

export default function ExpenseForm({ group }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [inputMode, setInputMode] = useState("text");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(group.members?.[0]?.id || "");
  const [category, setCategory] = useState("Other");
  const [splitType, setSplitType] = useState("equal");
  const [selected, setSelected] = useState(group.members?.map((member) => member.id) || []);
  const [exactAmounts, setExactAmounts] = useState({});
  const [percentages, setPercentages] = useState({});
  const [shareUnits, setShareUnits] = useState({});
  const autoExactMemberIdRef = useRef(null);
  const autoPercentageMemberIdRef = useRef(null);
  const lastExactEditedMemberIdRef = useRef(null);
  const lastPercentageEditedMemberIdRef = useRef(null);

  const createExpenseMutation = useMutation({
    mutationFn: (expenseData) => createExpense(group.id, expenseData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group", group.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });

      navigate(`/app/groups/${group.id}`);
    },
  });

  const toggleMember = (id) => {
    setSelected((current) => {
      const next = current.includes(id) ? current.filter((memberId) => memberId !== id) : [...current, id];

      if (!next.includes(id)) {
        setExactAmounts((currentAmounts) => {
          const nextAmounts = {
            ...currentAmounts,
          };

          delete nextAmounts[id];
          return nextAmounts;
        });

        setPercentages((currentPercentages) => {
          const nextPercentages = {
            ...currentPercentages,
          };

          delete nextPercentages[id];
          return nextPercentages;
        });

        setShareUnits((currentShares) => {
          const nextShares = {
            ...currentShares,
          };

          delete nextShares[id];
          return nextShares;
        });
      }

      return next;
    });
  };

  const handleSplitTypeChange = (type) => {
    autoExactMemberIdRef.current = null;
    autoPercentageMemberIdRef.current = null;
    setSplitType(type);

    if (type === "exact") {
      setExactAmounts((current) => {
        const next = {};

        selected.forEach((id) => {
          next[id] = "";
        });

        return next;
      });
    }

    if (type === "percentage") {
      setPercentages(() => {
        const next = {};

        selected.forEach((id) => {
          next[id] = "";
        });

        return next;
      });
    }

    if (type === "shares") {
      setShareUnits((current) => {
        const next = { ...current };

        selected.forEach((id) => {
          if (next[id] === undefined) {
            next[id] = 1;
          }
        });

        return next;
      });
    }
  };

  const selectedMembers = useMemo(() => {
    return group.members.filter((member) => selected.includes(member.id));
  }, [group.members, selected]);

  const calculatedSplits = useMemo(() => {
    return calculateSplits({
      amount,
      members: selectedMembers,
      splitType,
      exactAmounts,
      percentages,
      shareUnits,
    });
  }, [amount, selectedMembers, splitType, exactAmounts, percentages, shareUnits]);

  const calculatedSplitTotal = useMemo(() => {
    return calculatedSplits.reduce((total, item) => total + Number(item.share || 0), 0);
  }, [calculatedSplits]);

  const parseExpense = (inputText = description) => {
    if (!inputText.trim()) {
      return;
    }

    const parsed = parseExpenseText(inputText, group.members, user?.id);

    console.log("PARSED EXPENSE:", JSON.stringify(parsed, null, 2));

    if (parsed.amount) {
      setAmount(parsed.amount);
    }
    if (parsed.paidBy) {
      setPaidBy(parsed.paidBy);
    }
    if (parsed.category) {
      setCategory(parsed.category);
    }

    setDescription(inputText);

    if (!selected.length) {
      setSelected(group.members.map((member) => member.id));
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      return;
    }

    if (!paidBy) {
      return;
    }

    if (!selected.length) {
      return;
    }

    console.log("SPLIT VALIDATION:", splitValidation);

    if (!splitValidation.valid) {
      return;
    }

    const participants = calculateSplits({
      amount,
      members: selectedMembers,
      splitType,
      exactAmounts,
      percentages,
      shareUnits,
    });

    console.log("CALCULATED PARTICIPANTS:", JSON.stringify(participants, null, 2));

    if (!participants.length || participants.length !== selectedMembers.length) {
      return;
    }

    const expenseData = {
      title: description.trim() || `${category} expense`,
      amount: Number(amount),
      paidBy,
      category,
      splitType,
      participants,
    };

    console.log("FINAL EXPENSE DATA:", JSON.stringify(expenseData, null, 2));

    createExpenseMutation.mutate(expenseData);
  };

  const paidByMember = useMemo(() => {
    return group.members.find((member) => String(member.id) === String(paidBy));
  }, [group.members, paidBy]);

  const equalShareAmount = selected.length > 0 ? Number(amount || 0) / selected.length : 0;

  const handleVoiceInput = async () => {
    try {
      setVoiceError("");

      setIsListening(true);

      const transcript = await startSpeechRecognition();

      console.log("VOICE TRANSCRIPT:", transcript);

      if (!transcript) {
        setVoiceError("I couldn't hear anything. Please try again.");

        return;
      }

      setInputMode("text");

      parseExpense(transcript);
    } catch (error) {
      console.error("VOICE INPUT ERROR:", error);

      setVoiceError(error?.message || "Unable to use voice input.");
    } finally {
      setIsListening(false);
    }
  };

  const handleExactAmountChange = (userId, value) => {
    lastExactEditedMemberIdRef.current = userId;

    setExactAmounts((prev) => {
      const next = {
        ...prev,
        [userId]: value,
      };

      const total = Number(amount) || 0;

      if (autoExactMemberIdRef.current && String(autoExactMemberIdRef.current) === String(userId)) {
        autoExactMemberIdRef.current = null;

        return next;
      }

      if (autoExactMemberIdRef.current) {
        const autoMemberId = autoExactMemberIdRef.current;

        const enteredTotal = selectedMembers.reduce((sum, member) => {
          if (String(member.id) === String(autoMemberId)) {
            return sum;
          }

          const value = Number(next[member.id]);

          return sum + (Number.isFinite(value) ? value : 0);
        }, 0);

        const remaining = Math.max(0, total - enteredTotal);

        next[autoMemberId] = remaining.toFixed(2);

        return next;
      }

      const emptyMembers = selectedMembers.filter((member) => next[member.id] === undefined || next[member.id] === "");

      if (emptyMembers.length === 1) {
        const emptyMember = emptyMembers[0];

        const enteredTotal = selectedMembers.reduce((sum, member) => {
          if (String(member.id) === String(emptyMember.id)) {
            return sum;
          }

          const value = Number(next[member.id]);

          return sum + (Number.isFinite(value) ? value : 0);
        }, 0);

        const remaining = Math.max(0, total - enteredTotal);

        next[emptyMember.id] = remaining.toFixed(2);

        autoExactMemberIdRef.current = emptyMember.id;
      }

      return next;
    });
  };

  const handlePercentageChange = (userId, value) => {
    lastPercentageEditedMemberIdRef.current = userId;

    setPercentages((prev) => {
      const next = {
        ...prev,
        [userId]: value,
      };

      if (autoPercentageMemberIdRef.current && String(autoPercentageMemberIdRef.current) === String(userId)) {
        autoPercentageMemberIdRef.current = null;

        return next;
      }

      if (autoPercentageMemberIdRef.current) {
        const autoMemberId = autoPercentageMemberIdRef.current;

        const enteredPercentage = selectedMembers.reduce((sum, member) => {
          if (String(member.id) === String(autoMemberId)) {
            return sum;
          }

          const value = Number(next[member.id]);

          return sum + (Number.isFinite(value) ? value : 0);
        }, 0);

        const remainingPercentage = Math.max(0, 100 - enteredPercentage);

        next[autoMemberId] = remainingPercentage.toFixed(2);

        return next;
      }

      const emptyMembers = selectedMembers.filter((member) => next[member.id] === undefined || next[member.id] === "");

      if (emptyMembers.length === 1) {
        const emptyMember = emptyMembers[0];

        const enteredPercentage = selectedMembers.reduce((sum, member) => {
          if (String(member.id) === String(emptyMember.id)) {
            return sum;
          }

          const value = Number(next[member.id]);

          return sum + (Number.isFinite(value) ? value : 0);
        }, 0);

        const remainingPercentage = Math.max(0, 100 - enteredPercentage);

        next[emptyMember.id] = remainingPercentage.toFixed(2);

        autoPercentageMemberIdRef.current = emptyMember.id;
      }

      return next;
    });
  };

  const isExactAmountInvalid = (userId) => {
    const lastEditedId = lastExactEditedMemberIdRef.current;

    if (!lastEditedId || String(lastEditedId) !== String(userId)) {
      return false;
    }

    const currentValue = Number(exactAmounts[userId]);

    if (!Number.isFinite(currentValue) || currentValue < 0) {
      return true;
    }

    const total = Number(amount) || 0;

    const otherTotal = selectedMembers.reduce((sum, member) => {
      if (String(member.id) === String(userId)) {
        return sum;
      }

      if (autoExactMemberIdRef.current && String(member.id) === String(autoExactMemberIdRef.current)) {
        return sum;
      }

      const value = Number(exactAmounts[member.id]);

      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    return currentValue > total - otherTotal + 0.01;
  };

  const isPercentageInvalid = (userId) => {
    const lastEditedId = lastPercentageEditedMemberIdRef.current;

    if (!lastEditedId || String(lastEditedId) !== String(userId)) {
      return false;
    }

    const currentValue = Number(percentages[userId]);

    if (!Number.isFinite(currentValue) || currentValue < 0 || currentValue > 100) {
      return true;
    }

    const otherTotal = selectedMembers.reduce((sum, member) => {
      if (String(member.id) === String(userId)) {
        return sum;
      }

      if (autoPercentageMemberIdRef.current && String(member.id) === String(autoPercentageMemberIdRef.current)) {
        return sum;
      }

      const value = Number(percentages[member.id]);

      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    return currentValue > 100 - otherTotal + 0.01;
  };

  const splitValidation = useMemo(() => {
    const total = Number(amount) || 0;
    const calculatedTotal = Number(calculatedSplitTotal) || 0;

    if (!selectedMembers.length) {
      return {
        valid: false,
        message: "Select at least one member.",
      };
    }

    if (total <= 0) {
      return {
        valid: false,
        message: "Enter a valid expense amount.",
      };
    }

    if (splitType === "exact") {
      const exactTotal = selectedMembers.reduce((sum, member) => sum + (Number(exactAmounts[member.id]) || 0), 0);

      return {
        valid: Math.abs(calculatedSplitTotal - total) <= 0.01,
        message:
          Math.abs(exactTotal - total) <= 0.01 ? "" : `Amounts must add up to ₹${total.toLocaleString("en-IN")}.`,
      };
    }

    if (splitType === "percentage") {
      const percentageTotal = selectedMembers.reduce((sum, member) => sum + (Number(percentages[member.id]) || 0), 0);

      return {
        valid: Math.abs(percentageTotal - 100) <= 0.01,
        message: Math.abs(percentageTotal - 100) <= 0.01 ? "" : "Percentages must add up to 100%.",
      };
    }

    if (splitType === "shares") {
      const shareTotal = selectedMembers.reduce((sum, member) => sum + (Number(shareUnits[member.id]) || 0), 0);

      return {
        valid: shareTotal > 0,
        message: shareTotal > 0 ? "" : "Enter at least one share.",
      };
    }

    return {
      valid: calculatedSplits.length === selectedMembers.length && Math.abs(calculatedTotal - total) <= 0.01,
      message: "",
    };
  }, [
    amount,
    selectedMembers,
    splitType,
    exactAmounts,
    percentages,
    shareUnits,
    calculatedSplits,
    calculatedSplitTotal,
  ]);

  return (
    <form className="expense-ai-form" onSubmit={handleAddExpense}>
      <div className="expense-input-modes">
        <button type="button" className={inputMode === "text" ? "active" : ""} onClick={() => setInputMode("text")}>
          <FileText size={16} />
          Text
        </button>

        <button type="button" className={inputMode === "voice" ? "active" : ""} onClick={() => setInputMode("voice")}>
          <Mic size={16} />
          Voice
        </button>

        <button type="button" className={inputMode === "bill" ? "active" : ""} onClick={() => setInputMode("bill")}>
          <Plus size={16} />
          Bill
        </button>
      </div>

      {inputMode === "text" && (
        <>
          <div className="expense-description-section">
            <label>What happened?</label>

            <textarea
              value={description}
              onChange={handleDescriptionChange}
              onBlur={() => parseExpense()}
              placeholder="e.g. Rahul paid ₹5,000 for hotel, we were 5 people."
              maxLength={500}
            />

            <div className="character-count">{description.length}/500</div>
          </div>

          <div className="expense-edit-section">
            <div className="expense-edit-field">
              <label>Amount</label>

              <input
                type="number"
                value={amount}
                min="0"
                step="0.01"
                placeholder="Enter amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="expense-edit-field">
              <label>Paid by</label>

              <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                {group.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="expense-edit-field">
              <label>Category</label>

              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Food">Food</option>
                <option value="Hotel">Hotel</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="expense-edit-field">
              <label>Split between</label>

              <MemberSelector members={group.members} selected={selected} onToggle={toggleMember} />
            </div>

            <div className="expense-edit-field">
              <label>Split type</label>

              <SplitSelector value={splitType} onChange={handleSplitTypeChange} />
            </div>

            {splitType === "exact" && (
              <div className="split-inputs">
                <h4>Enter each person's amount</h4>

                {selectedMembers.map((member) => (
                  <div className="split-input-row" key={member.id}>
                    <span>{member.name}</span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="₹0"
                      value={exactAmounts[member.id] ?? ""}
                      className={
                        exactAmounts[member.id] !== "" &&
                        exactAmounts[member.id] !== undefined &&
                        isExactAmountInvalid(member.id)
                          ? "split-input-error"
                          : ""
                      }
                      onChange={(e) => handleExactAmountChange(member.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}

            {splitType === "percentage" && (
              <div className="split-inputs">
                <h4>Enter each person's percentage</h4>

                {selectedMembers.map((member) => (
                  <div className="split-input-row" key={member.id}>
                    <span>{member.name}</span>

                    <div className="split-number-with-suffix">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="0"
                        value={percentages[member.id] ?? ""}
                        className={
                          percentages[member.id] !== "" &&
                          percentages[member.id] !== undefined &&
                          isPercentageInvalid(member.id)
                            ? "split-input-error"
                            : ""
                        }
                        onChange={(e) => handlePercentageChange(member.id, e.target.value)}
                      />

                      <span>%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {splitType === "shares" && (
              <div className="split-inputs">
                <h4>Assign shares</h4>

                {selectedMembers.map((member) => (
                  <div className="split-input-row" key={member.id}>
                    <span>{member.name}</span>

                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="1"
                      value={shareUnits[member.id] ?? ""}
                      onChange={(e) =>
                        setShareUnits((current) => ({
                          ...current,
                          [member.id]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* =========================================
          VOICE MODE
      ========================================= */}

      {inputMode === "voice" && (
        <div className="voice-input-box">
          <button
            type="button"
            className={`voice-record-button ${isListening ? "recording" : ""}`}
            onClick={handleVoiceInput}
            disabled={isListening}
          >
            <Mic size={30} />
          </button>

          <strong>{isListening ? "Listening..." : "Tap to speak"}</strong>

          <span>{isListening ? "Tell me about your expense" : 'Try "Rahul paid ₹5,000 for hotel"'}</span>

          {voiceError && <small className="voice-error">{voiceError}</small>}
        </div>
      )}

      {/* =========================================
          BILL MODE
      ========================================= */}

      {inputMode === "bill" && (
        <div className="bill-input-box">
          <FileText size={30} />

          <span>Upload or scan your bill</span>

          <button type="button">Choose Bill</button>
        </div>
      )}

      {/* =========================================
          EXPENSE SUMMARY
      ========================================= */}

      {(inputMode === "text" || calculatedSplits.length > 0) && (
        <div className="expense-understood">
          <h3>I understood this as:</h3>

          {/* AMOUNT */}

          <div className="understood-row">
            <div className="understood-label">
              <span className="understood-icon">₹</span>

              <span>Amount</span>
            </div>

            <strong>₹{Number(amount || 0).toLocaleString("en-IN")}</strong>
          </div>

          {/* PAID BY */}

          <div className="understood-row">
            <div className="understood-label">
              <span className="understood-icon">₹</span>

              <span>Paid by</span>
            </div>

            <strong>{paidByMember?.name || "-"}</strong>
          </div>

          {/* CATEGORY */}

          <div className="understood-row">
            <div className="understood-label">
              <span className="understood-icon">◉</span>

              <span>Category</span>
            </div>

            <strong>{category}</strong>
          </div>

          {/* SPLIT */}

          <div className="understood-row">
            <div className="understood-label">
              <span className="understood-icon">⇄</span>

              <span>Split</span>
            </div>

            <strong>
              {splitType === "equal"
                ? "Equal"
                : splitType === "exact"
                ? "Exact amounts"
                : splitType === "percentage"
                ? "Percentage"
                : "Shares"}
            </strong>
          </div>

          {/* PEOPLE */}

          <div className="understood-row">
            <div className="understood-label">
              <span className="understood-icon">👥</span>

              <span>Split between</span>
            </div>

            <strong>{selected.length} people</strong>
          </div>
        </div>
      )}

      {/* =========================================
          SHARE PREVIEW
      ========================================= */}

      {amount && selected.length > 0 && (
        <div className="expense-share-preview">
          <div className="expense-share-header">
            <span>{splitType === "equal" ? "Each person pays" : "Calculated shares"}</span>

            <strong>
              ₹
              {calculatedSplitTotal.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="expense-share-list">
            {calculatedSplits.map((item) => {
              const member = selectedMembers.find((m) => String(m.id) === String(item.userId));

              return (
                <div className="expense-share-row" key={item.userId}>
                  <span>{member?.name || "Unknown"}</span>

                  <strong>
                    ₹
                    {Number(item.share || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
              );
            })}
          </div>

          {splitType === "exact" && Math.abs(calculatedSplitTotal - Number(amount || 0)) > 0.01 && (
            <small className="split-error">Amounts must equal ₹{Number(amount || 0).toLocaleString("en-IN")}</small>
          )}

          {splitType === "percentage" && <small className="split-info">Percentages must add up to 100%.</small>}
        </div>
      )}

      {createExpenseMutation.isError && (
        <div className="form-error">{createExpenseMutation.error?.message || "Failed to add expense."}</div>
      )}

      <div className="expense-confirmation">
        <h3>Looks correct?</h3>

        <div className="expense-confirm-buttons">
          <button
            type="submit"
            className="expense-add-button"
            disabled={
              createExpenseMutation.isPending ||
              Number(amount) <= 0 ||
              !paidBy ||
              selectedMembers.length === 0 ||
              calculatedSplits.length !== selectedMembers.length ||
              !splitValidation.valid
            }
          >
            <Check size={18} />
            {createExpenseMutation.isPending ? "Adding..." : "Yes, Add"}
          </button>

          <button
            type="button"
            className="expense-edit-button"
            disabled={createExpenseMutation.isPending}
            onClick={() => setInputMode("text")}
          >
            <Pencil size={16} />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </form>
  );
}
