"use client";

import { useCallback, useState } from "react";
import useModal from "./useModal";
import { ApiError } from "@/types/api/error";

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
