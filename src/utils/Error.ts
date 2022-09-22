export class FormError extends Error {
  fieldErrors?: Record<string, string[]>

  constructor(reason?: string | Record<string, string[]>) {
    super(typeof reason === "string" ? reason : "")

    if (typeof reason === "object") {
      this.fieldErrors = reason
    }
  }
}
