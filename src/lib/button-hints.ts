/**
 * Plain-English explanations shown when someone hovers (or presses and holds)
 * a button, so they know what it does before they press it.
 *
 * Keys are matched against the button's visible text (lowercased, trimmed).
 * Add new entries here — every button with that label across the app picks it up.
 */
export const BUTTON_HINTS: Record<string, string> = {
  // Saving / submitting
  save: "Saves your changes.",
  "save changes": "Saves your changes.",
  submit: "Sends this form in.",
  create: "Creates a new item with what you've filled in.",
  add: "Adds a new item to the list.",
  update: "Saves the new information over the old.",
  confirm: "Confirms this and continues.",
  continue: "Moves on to the next step.",
  next: "Goes to the next step.",
  back: "Goes back one step.",
  finish: "Completes this and closes it out.",
  apply: "Applies what you've chosen.",
  send: "Sends this out now.",
  "send email": "Sends the email now.",
  "send test": "Sends a test version to you first.",
  publish: "Makes this visible to everyone.",
  approve: "Marks this as accepted.",
  reject: "Marks this as turned down.",
  verify: "Checks this and marks it as confirmed.",

  // Leaving / undoing
  cancel: "Closes this without saving anything.",
  close: "Closes this window.",
  dismiss: "Hides this message.",
  reset: "Puts everything back to how it started.",
  clear: "Empties what you've entered.",
  "clear filters": "Removes all filters and shows everything again.",
  delete: "Permanently removes this. This can't be undone.",
  remove: "Takes this off the list.",
  archive: "Moves this out of the way without deleting it.",
  deactivate: "Turns this off so it stops showing.",
  activate: "Turns this on so it starts showing.",

  // Getting things out
  export: "Downloads this list as a spreadsheet.",
  "export csv": "Downloads this list as a spreadsheet you can open in Excel.",
  "export pdf": "Downloads this as a PDF document.",
  download: "Saves a copy to your computer.",
  print: "Opens the print window.",
  copy: "Copies this to your clipboard so you can paste it elsewhere.",
  "copy link": "Copies the web address so you can paste it anywhere.",
  "copy email": "Copies the email text so you can paste it into your mail app.",
  share: "Gives you a way to send this to someone else.",

  // Getting things in
  import: "Brings in information from a file.",
  upload: "Adds a file from your computer.",
  "choose file": "Picks a file from your computer.",
  browse: "Opens your files to pick one.",

  // Looking around
  refresh: "Reloads the latest information.",
  reload: "Reloads the latest information.",
  search: "Finds matches for what you typed.",
  filter: "Narrows the list down to what you choose.",
  "view all": "Shows the full list.",
  "view details": "Opens the full information for this item.",
  details: "Opens the full information for this item.",
  edit: "Opens this so you can change it.",
  preview: "Shows how this will look before it goes out.",
  "learn more": "Opens more information about this.",
  retry: "Tries that again.",
  "try again": "Tries that again.",

  // Accounts
  "sign in": "Logs you into your account.",
  "log in": "Logs you into your account.",
  "sign up": "Creates a new account for you.",
  "sign out": "Logs you out of your account.",
  "log out": "Logs you out of your account.",
  register: "Creates a new account for you.",

  // Money
  subscribe: "Starts a paid plan.",
  upgrade: "Moves you to a bigger plan with more included.",
  checkout: "Takes you to payment.",
  "buy now": "Takes you straight to payment.",
  pay: "Takes you to payment.",
  "manage subscription": "Opens your plan so you can change or cancel it.",
};

/** Pulls readable text out of a button's children so we can look up a hint. */
export function extractButtonText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractButtonText).join(" ");
  const el = node as { props?: { children?: React.ReactNode } };
  if (el && el.props && el.props.children !== undefined) {
    return extractButtonText(el.props.children);
  }
  return "";
}

export function getButtonHint(text: string): string | undefined {
  const key = text.replace(/\s+/g, " ").trim().toLowerCase().replace(/[.…]+$/, "");
  if (!key) return undefined;
  return BUTTON_HINTS[key];
}
