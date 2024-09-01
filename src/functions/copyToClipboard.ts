export const copyToClipboard = (textToCopy: string) => {
  // Create a temporary textarea element
  const textarea = document.createElement("textarea");
  // Set the value to the text you want to copy
  textarea.value = textToCopy;
  // Append the textarea to the body
  document.body.appendChild(textarea);
  // Select the text
  textarea.select();
  // Copy the text
  document.execCommand("copy");
  // Remove the textarea from the body
  document.body.removeChild(textarea);
  // Optionally, notify the user that the text was copied
  //alert("Text copied to clipboard!");
};
