/** Pure, shared validation for password-based authentication. */
export function isValidEmail(value:string):boolean {
  return value.length>0 && value.length<=254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function isValidPassword(password:string):boolean {
  return password.length>=12 && password.length<=128
    && /[a-z]/.test(password) && /[A-Z]/.test(password)
    && /[0-9]/.test(password);
}
