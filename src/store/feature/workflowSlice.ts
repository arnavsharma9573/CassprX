// store/feature/workflowSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type ContentCreatorSubTask =
  | "CAROUSEL"
  | "MASCOT"
  | "MEME"
  | "UGC"
  | "PRESET"
  | "PRINT_AD";
export type AgentSubTask = ContentCreatorSubTask | null;

interface WorkflowState {
  activeAgentId: string | null;
  activeSubTask: AgentSubTask;
  currentPhaseIndex: number;
  currentStepIndex: number;
  taskData: Record<string, any>;
  isWorkspaceOpen: boolean;
  phaseStatus: "in-progress" | "awaiting-api-call" | "complete";
  apiResult: Record<string, any> | null;
}

const initialState: WorkflowState = {
  activeAgentId: null,
  activeSubTask: null,
  currentPhaseIndex: 0,
  currentStepIndex: 0,
  taskData: {},
  isWorkspaceOpen: false,
  phaseStatus: "in-progress",
  apiResult: null,
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    startWorkflow: (state, action: PayloadAction<string>) => {
      return {
        ...initialState,
        activeAgentId: action.payload,
        isWorkspaceOpen: true,
      };
    },
    selectSubTask: (state, action: PayloadAction<AgentSubTask>) => {
      state.activeSubTask = action.payload;
      state.currentPhaseIndex = 0;
      state.currentStepIndex = 0;
      state.taskData = {};
      state.apiResult = null;
      state.phaseStatus = "in-progress";
    },
    submitStep: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.taskData[action.payload.key] = action.payload.value;
      state.currentStepIndex += 1;
    },
    completePhase: (state) => {
      state.phaseStatus = "awaiting-api-call";
    },
    storeApiResult: (state, action: PayloadAction<Record<string, any>>) => {
      state.apiResult = action.payload;
    },
    startNextPhase: (
      state,
      action: PayloadAction<{ newData?: Record<string, any> }>
    ) => {
      if (action.payload.newData) {
        state.taskData = { ...state.taskData, ...action.payload.newData };
      }
      state.currentPhaseIndex += 1;
      state.currentStepIndex = 0;
      state.phaseStatus = "in-progress";
      state.apiResult = null;
    },
    revertStep: (state) => {
      if (state.currentStepIndex > 0) {
        state.currentStepIndex -= 1;
      }
    },
    resetWorkflow: () => initialState,
  },
});

export const {
  startWorkflow,
  selectSubTask,
  submitStep,
  completePhase,
  storeApiResult,
  startNextPhase,
  resetWorkflow,
  revertStep,
} = workflowSlice.actions;

export const selectActiveWorkflow = (state: RootState) => state.workflow;
export const selectWorkflowTaskData = (state: RootState) =>
  state.workflow.taskData;

export default workflowSlice.reducer;
