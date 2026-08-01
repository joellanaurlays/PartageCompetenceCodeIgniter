import api  from "./api";
import { LikeResponse } from "../types";

export const likeService = {
    toggle: (userId: number, publicationId: number) => 
        api.post<LikeResponse>(`/likes/${userId}/${publicationId}`),

    getCount: (publicationId: number) =>
        api.get<{nombre_de_like: number}>(`/likes/${publicationId}`)
};
