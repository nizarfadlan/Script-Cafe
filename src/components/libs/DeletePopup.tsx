import React from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  handler?: () => void;
}

export const DeletePopUp = ({
  isOpen,
  onOpenChange,
  handler,
}: Props) => {
  return (
    <Modal
      aria-labelledby="modal-delete"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Delete Confirmation</ModalHeader>
            <ModalBody>
              Are you sure want to delete this data?
            </ModalBody>
            <ModalFooter className="flex items-center justify-center">
              <Button
                variant="light"
                onPress={onClose}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                variant="shadow"
                color="danger"
                onPress={() => {
                  handler?.();
                  onOpenChange();
                }}
                className="w-full"
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
