import { toast } from "sonner";

export function messageHandler(error: Error) {
  if (error.message) {
    const errorMessage = error.message;
    const firstDotIndex = errorMessage.indexOf(".");

    if (firstDotIndex !== -1) {
      toast.error(errorMessage.slice(0, firstDotIndex), {
        description: errorMessage.slice(firstDotIndex + 1),
      });
    } else {
      toast.error(errorMessage);
    }
  } else {
    toast.error("Произошла ошибка на стороне сервера!");
  }
}
