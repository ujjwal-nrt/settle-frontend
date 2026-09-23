import { Capacitor, registerPlugin } from "@capacitor/core";

const ContactPicker = registerPlugin("ContactPicker");

export async function pickContacts() {
  try {
    if (!Capacitor.isNativePlatform()) {
      throw new Error("Contact picker is only available in the Android app.");
    }

    if (typeof ContactPicker?.pickContacts !== "function") {
      throw new Error("Native ContactPicker plugin is not registered.");
    }

    console.log("Calling native ContactPicker.pickContacts()...");

    const result = await ContactPicker.pickContacts();

    console.log("Native picker result:", result);

    console.log("Native picker result JSON:", JSON.stringify(result, null, 2));

    console.log("Contacts JSON:", JSON.stringify(result?.contacts || [], null, 2));

    return result?.contacts || [];
  } catch (error) {
    console.error("CONTACT PICKER ERROR:", error);

    throw error;
  }
}
