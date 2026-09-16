import type { ResponseState } from "@/lib/domain";

const transitions: Record<ResponseState, ResponseState[]> = {
  RECEIVED: ["AWAITING_ACKNOWLEDGEMENT"],
  AWAITING_ACKNOWLEDGEMENT: ["ACCEPTED", "UNASSIGNED"],
  ACCEPTED: ["ACTION_UNDERWAY"],
  ACTION_UNDERWAY: ["CLOSED_WITH_OUTCOME", "UNASSIGNED"],
  CLOSED_WITH_OUTCOME: ["REVIEW_REQUESTED"],
  REVIEW_REQUESTED: ["ACTION_UNDERWAY"],
  UNASSIGNED: ["ACCEPTED"],
};

export function transitionResponse(from: ResponseState, to: ResponseState): ResponseState {
  if (!transitions[from].includes(to)) throw new Error(`Invalid response transition: ${from} → ${to}`);
  return to;
}
