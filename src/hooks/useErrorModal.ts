"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/types/api/error";
import useModal from "./useModal";

export default function useErrorModal() {
  const [error, setError] = useState<ApiError>({
    code: "",
    message: "",
  });

  const setErrorContext = useCallback((context: ApiError) => {
    setError(context);
  }, []);

  const { isModalOpen, openModal, closeModal } = useModal();

  return { error, setErrorContext, isModalOpen, openModal, closeModal };
}
