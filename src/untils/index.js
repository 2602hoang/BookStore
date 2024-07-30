export function formatCurrency(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}
export function formattedTimestamp(timestamp) {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium',
  });
  return formattedDate;
}
export function formatPhoneNumber(phone) {
  // Ensure the phone number is a string
  phone = phone.toString();
  // Show only the last 3 digits of the phone number
  return phone.length >= 3 ? phone.slice(-3) : phone;
}
