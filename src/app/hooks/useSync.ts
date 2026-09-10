import { useState } from "react";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { FetchSyncStatus, StartSync, StopSync, PullSync } from "@/src/api/sync";
import { Sync } from "@/src/types/types";

export default function useSync(){
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);


    const startSync = () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (data: Sync) => StartSync(),
            onSuccess: () => {
                console.log("Sync Success")
            }
        })
    }
    
    const stopSync = () => {
        const queryClient = useQueryClient();
    }
    
}