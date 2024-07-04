import { useState } from 'react';

export interface SaveChangesState {
    isLoading: boolean;
    isSuccess: boolean;
}

export const useLoading = (isLoading = false) => {
    const [state, setState] = useState<SaveChangesState>({
        isLoading,
        isSuccess: false,
    });

    const handleStateChange = (changedState : Partial<SaveChangesState>) => {
        setState((prev) => ({ ...prev, ...changedState }));
    };

    return { handleStateChange, state };
};
