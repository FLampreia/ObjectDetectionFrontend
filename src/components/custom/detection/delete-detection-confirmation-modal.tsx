"use client";

import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmationModal } from "@/components/custom/layout/confirmation-modal";
import { deleteDetections } from "@/services/detections";
import { useNotification } from "@/providers/notification-provider";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    detection_id: string | string[];
    onDeleted?: () => void;
};

export function DeleteDetectionConfirmationModal({ isOpen, onOpenChange, detection_id, onDeleted }: Props) {
    const queryClient = useQueryClient();
    const notify = useNotification();
    const ids = [...new Set(Array.isArray(detection_id) ? detection_id : detection_id ? [detection_id] : [])];
    const count = ids.length;
    const isSingle = count === 1;

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={isSingle ? "Delete detection" : "Delete detections"}
            description={isSingle ? "Are you sure you want to delete this detection?" : `Are you sure you want to delete ${count} selected detections?`}
            icon={<Trash2 />}
            warning={isSingle ? "The detection and its associated objects will be permanently deleted." : "The selected detections and their associated objects will be permanently deleted."}
            actionLabel={isSingle ? "Delete detection" : `Delete ${count} detections`}
            isDisabled={count === 0}
            onConfirm={() => deleteDetections(ids)}
            onConfirmed={() => {
                notify(isSingle ? "Detection deleted" : `${count} detections deleted`);
                void queryClient.invalidateQueries({ queryKey: ["detections"] });
                void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
                onDeleted?.();
            }}
        />
    );
}
