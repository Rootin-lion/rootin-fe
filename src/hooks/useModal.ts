"use client";

import { useCallback, useState } from "react";

export default function useModal() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return { isModalOpen, openModal, closeModal };
}
