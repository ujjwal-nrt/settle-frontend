export const roundMoney = (value) => {
  return Math.round((Number(value) || 0) * 100) / 100;
};

export const isBlank = (value) => {
  return value === undefined || value === null || value === "";
};

export const calculateSplits = ({
  amount,
  members = [],
  splitType = "equal",
  exactAmounts = {},
  percentages = {},
  shareUnits = {},
}) => {
  const total = roundMoney(Number(amount) || 0);

  if (!members.length) {
    return [];
  }

  if (splitType === "equal") {
    const equalShare = roundMoney(total / members.length);

    return members.map((member) => ({
      userId: member.id,
      share: equalShare,
    }));
  }

  if (splitType === "exact") {
    const values = members.map((member) => {
      const value = exactAmounts?.[member.id];

      return {
        userId: member.id,
        value,
        share: isBlank(value) ? 0 : roundMoney(Number(value) || 0),
        empty: isBlank(value),
      };
    });

    const emptyMembers = values.filter((item) => item.empty);

    if (emptyMembers.length === 1) {
      const enteredTotal = roundMoney(values.reduce((sum, item) => sum + item.share, 0));

      const emptyMember = emptyMembers[0];

      const remaining = roundMoney(total - enteredTotal);

      return values.map((item) => ({
        userId: item.userId,
        share: item.userId === emptyMember.userId ? Math.max(0, remaining) : item.share,
      }));
    }

    return values.map((item) => ({
      userId: item.userId,
      share: item.share,
    }));
  }

  if (splitType === "percentage") {
    const values = members.map((member) => {
      const value = percentages?.[member.id];

      return {
        userId: member.id,
        value,
        percentage: isBlank(value) ? 0 : Number(value) || 0,
        empty: isBlank(value),
      };
    });

    const emptyMembers = values.filter((item) => item.empty);

    if (emptyMembers.length === 1) {
      const enteredPercentage = roundMoney(values.reduce((sum, item) => sum + item.percentage, 0));

      const emptyMember = emptyMembers[0];

      const remainingPercentage = roundMoney(100 - enteredPercentage);

      return values.map((item) => ({
        userId: item.userId,
        share: roundMoney(
          (total * (item.userId === emptyMember.userId ? Math.max(0, remainingPercentage) : item.percentage)) / 100,
        ),
      }));
    }

    return values.map((item) => ({
      userId: item.userId,
      share: roundMoney((total * item.percentage) / 100),
    }));
  }

  if (splitType === "shares") {
    const normalizedShares = members.map((member) => {
      const value = Number(shareUnits?.[member.id]);

      return {
        userId: member.id,
        units: Number.isFinite(value) && value > 0 ? value : 0,
      };
    });

    const totalUnits = normalizedShares.reduce((sum, item) => sum + item.units, 0);

    if (totalUnits <= 0) {
      return normalizedShares.map((item) => ({
        userId: item.userId,
        share: 0,
      }));
    }

    return normalizedShares.map((item) => ({
      userId: item.userId,
      share: roundMoney((total * item.units) / totalUnits),
    }));
  }

  return members.map((member) => ({
    userId: member.id,
    share: 0,
  }));
};

export const validateSplit = ({
  amount,
  members = [],
  splitType = "equal",
  exactAmounts = {},
  percentages = {},
  shareUnits = {},
}) => {
  const total = roundMoney(Number(amount) || 0);

  if (!members.length) {
    return {
      valid: false,
      message: "Select at least one person.",
    };
  }

  if (total <= 0) {
    return {
      valid: false,
      message: "Enter a valid amount.",
    };
  }

  if (splitType === "equal") {
    return {
      valid: true,
      message: "",
    };
  }

  if (splitType === "exact") {
    const emptyMembers = members.filter((member) => isBlank(exactAmounts?.[member.id]));

    const exactTotal = roundMoney(
      members.reduce((sum, member) => {
        const value = exactAmounts?.[member.id];

        return sum + (isBlank(value) ? 0 : Number(value) || 0);
      }, 0),
    );

    if (members.length === 2 && emptyMembers.length > 1) {
      return {
        valid: false,
        message: "Enter an amount.",
      };
    }

    if (members.length > 2 && emptyMembers.length > 0) {
      return {
        valid: false,
        message: "Enter an amount for every person.",
      };
    }

    if (exactTotal > total + 0.01) {
      return {
        valid: false,
        message: `Amounts cannot exceed ₹${total.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}.`,
      };
    }

    if (Math.abs(exactTotal - total) > 0.01) {
      return {
        valid: false,
        message: `Amounts must add up to ₹${total.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}.`,
      };
    }

    return {
      valid: true,
      message: "",
    };
  }

  if (splitType === "percentage") {
    const emptyMembers = members.filter((member) => isBlank(percentages?.[member.id]));

    const percentageTotal = roundMoney(
      members.reduce((sum, member) => {
        const value = percentages?.[member.id];

        return sum + (isBlank(value) ? 0 : Number(value) || 0);
      }, 0),
    );

    if (members.length === 2 && emptyMembers.length > 1) {
      return {
        valid: false,
        message: "Enter a percentage.",
      };
    }

    if (members.length > 2 && emptyMembers.length > 0) {
      return {
        valid: false,
        message: "Enter a percentage for every person.",
      };
    }

    const hasInvalidPercentage = members.some((member) => {
      const value = percentages?.[member.id];

      if (isBlank(value)) {
        return false;
      }

      const percentage = Number(value);

      return !Number.isFinite(percentage) || percentage < 0 || percentage > 100;
    });

    if (hasInvalidPercentage) {
      return {
        valid: false,
        message: "Percentage must be between 0% and 100%.",
      };
    }

    if (percentageTotal > 100.01) {
      return {
        valid: false,
        message: "Percentages cannot exceed 100%.",
      };
    }

    if (Math.abs(percentageTotal - 100) > 0.01) {
      return {
        valid: false,
        message: "Percentages must add up to 100%.",
      };
    }

    return {
      valid: true,
      message: "",
    };
  }

  if (splitType === "shares") {
    const invalidShare = members.some((member) => {
      const value = shareUnits?.[member.id];

      if (isBlank(value)) {
        return true;
      }

      const units = Number(value);

      return !Number.isFinite(units) || units <= 0;
    });

    if (invalidShare) {
      return {
        valid: false,
        message: "Enter valid shares for every person.",
      };
    }

    const totalUnits = roundMoney(
      members.reduce((sum, member) => {
        return sum + (Number(shareUnits?.[member.id]) || 0);
      }, 0),
    );

    if (totalUnits <= 0) {
      return {
        valid: false,
        message: "Enter at least one share.",
      };
    }

    return {
      valid: true,
      message: "",
    };
  }

  return {
    valid: false,
    message: "Invalid split type.",
  };
};
