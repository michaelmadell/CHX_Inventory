import {
  Dialog,
  DialogPanel,
  DialogTitle
} from "@headlessui/react";
import { motion, AnimatePresence } from "motion/react";
import { type Node } from "../types";
import { X } from "lucide-react";

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node | null;
}

const DetailRow = ({ label, value }: { label: string, value?: string | number | null }) => (
    <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dl>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-mono">{value || 'N/A'}</dd>
        </dl>
    </div>
);

export default function NodeModal({ isOpen, onClose, node }: NodeModalProps) {

  const totalRam = (node?.ram0 ?? 0) + (node?.ram1 ?? 0);

  return (
    <AnimatePresence>
      {isOpen && node && (
        <Dialog as="div" className="relative z-10" static open={isOpen} onClose={onClose}>
          <motion.div
            className="fixed inset-0 bg-black/30"
            initial={{ opacity: 0, transition: { duration: 0.3 } }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }} />
        <div className="fixed inset-0 overflow-y-auto bg-black/30">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0, 0.71, 0.2, 1.01] } }}
              exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2, ease: [0, 0.71, 0.2, 1.01] } }}
              >
            <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <DialogTitle
                as="h3"
                className="flex justify-between items-center text-lg font-medium leading-6 text-gray-900 p-6 border-b"
              >
                <span>Node Details: {node.hostname || node.serialNumber}</span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="p-1 rounded-full hover:cursor-pointer hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </DialogTitle>

              <div className="mt-2">
                <dl className="divide-y divide-gray-200">
                  <DetailRow label="Hostname" value={node.hostname} />
                  <DetailRow label="Serial Number" value={node.serialNumber} />
                  <DetailRow label="Model" value={node.model} />
                  <DetailRow label="CPU" value={node.cpu} />
                  <DetailRow label="GPU" value={node.gpu} />
                  <DetailRow
                    label="Total RAM"
                    value={totalRam > 0 ? `${totalRam} GB` : "N/A"}
                  />
                  <DetailRow label="OS" value={node.os} />
                  <DetailRow label="Node Name" value={node.nodeName} />
                  <DetailRow label="Node Group" value={node.nodeGroup} />
                  <DetailRow label="Node Role" value={node.nodeRole} />
                  <DetailRow label="External IP" value={node.netExtIpv4} />
                  <DetailRow label="Internal MAC" value={node.netIntMac} />
                  <DetailRow label="External MAC" value={node.netExtMac} />
                </dl>
              </div>

              <div className="mt-4 p-6 bg-gray-50 text-right">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:cursor-pointer hover:bg-blue-200 focus:outline-none"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </DialogPanel>
            </motion.div>
          </div>
        </div>
      </Dialog>
      )}
      </AnimatePresence>
  );
}
