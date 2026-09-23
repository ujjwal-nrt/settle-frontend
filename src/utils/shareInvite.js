import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";

export async function shareSettleInvite(contact) {
  const message = `Hey ${contact.name || ""}! Join me on SettleG to easily split expenses with friends.

Download SettleG and let's settleG our expenses together.`;

  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share({
        title: "Join me on SettleG",
        text: message,
      });

      return;
    }

    // Browser fallback
    if (navigator.share) {
      await navigator.share({
        title: "Join me on SettleG",
        text: message,
      });

      return;
    }

    // Last fallback
    await navigator.clipboard.writeText(message);

    alert("Invite message copied to clipboard.");
  } catch (error) {
    console.error("SHARE INVITE ERROR:", error);
  }
}
