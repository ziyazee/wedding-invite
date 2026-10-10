import { useReducer } from 'react';
import { DEFAULT_SECTIONS_ORDER } from '../constants/sections';
import type { CreateFlowState, SectionType, TemplateId, WeddingDetails } from '../types';

const initialState: CreateFlowState = {
  currentStep: 0,
  eventType: null,
  details: {},
  templateId: null,
  sectionsOrder: DEFAULT_SECTIONS_ORDER,
};

type Action =
  | { type: 'SET_EVENT_TYPE'; payload: 'wedding' }
  | { type: 'SET_DETAILS'; payload: WeddingDetails }
  | { type: 'SET_TEMPLATE'; payload: TemplateId }
  | { type: 'SET_SECTIONS_ORDER'; payload: SectionType[] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' };

function reducer(state: CreateFlowState, action: Action): CreateFlowState {
  switch (action.type) {
    case 'SET_EVENT_TYPE':
      return { ...state, eventType: action.payload };
    case 'SET_DETAILS':
      return { ...state, details: action.payload };
    case 'SET_TEMPLATE':
      return { ...state, templateId: action.payload };
    case 'SET_SECTIONS_ORDER':
      return { ...state, sectionsOrder: action.payload };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 3) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
  }
}

export function useCreateFlow() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    state,
    setEventType: (type: 'wedding') => {
      dispatch({ type: 'SET_EVENT_TYPE', payload: type });
      dispatch({ type: 'NEXT_STEP' });
    },
    setDetails: (details: WeddingDetails) => {
      dispatch({ type: 'SET_DETAILS', payload: details });
      dispatch({ type: 'NEXT_STEP' });
    },
    setTemplate: (id: TemplateId) => {
      dispatch({ type: 'SET_TEMPLATE', payload: id });
      dispatch({ type: 'NEXT_STEP' });
    },
    setSectionsOrder: (order: SectionType[]) => {
      dispatch({ type: 'SET_SECTIONS_ORDER', payload: order });
    },
    goBack: () => dispatch({ type: 'PREV_STEP' }),
  };
}
