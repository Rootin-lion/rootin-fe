"use client";

import { useState } from "react";
import useModal from "./useModal";

interface ErrorContext {
  code: string;
  message: string;
}

export default function useErrorModal() {
  const [error, setError] = useState<ErrorContext>({
    code: "",
    message: "",
  });

  const setErrorContext = (context: ErrorContext) => {
    setError(context);
  };
  const { isModalOpen, openModal, closeModal } = useModal();

  return { error, setErrorContext, isModalOpen, openModal, closeModal };
}
