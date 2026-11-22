/** Pure, shared validation for password-based authentication. */
export function isValidEmail(value:string):boolean {
  return value.length>0 && value.length<=254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function isValidPassword(password:string):boolean {
  // Supabase may require more; enforce a useful minimum before making requests.
  return password.length>=10 && password.length<=128
    && /[a-z]/.test(password) && /[A-Z]/.test(password)
    && /[0-9]/.test(password);
}
