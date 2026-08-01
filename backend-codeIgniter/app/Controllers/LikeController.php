<?php

namespace App\Controllers;

use App\Models\LikeModel;
use App\Models\NotificationModel;
use App\Models\PublicationModel;
use CodeIgniter\API\ResponseTrait;

class LikeController extends BaseController
{
    use ResponseTrait;

    public function toggle($userId = null, $publicationId = null)
    {
        $likes = new LikeModel();
        $publications = new PublicationModel();
        $publication = $publications->find($publicationId);
        if (!$publication) {
            return $this->failNotFound('Publication non trouvée');
        }

        if ($likes->hasLiked($publicationId, $userId)) {
            $likes->where('publication_id', $publicationId)->where('utilisateur_id', $userId)->delete();
            $publications->decrementLikes($publicationId);
            $updated = $publications->find($publicationId);
            return $this->respond(['message' => 'Like retiré', 'action' => 'unlike', 'liked' => false, 'nombre_like_actuel' => (int) $updated['nombre_like']]);
        }

        $likes->insert(['publication_id' => $publicationId, 'utilisateur_id' => $userId, 'date' => date('Y-m-d H:i:s')]);
        $publications->incrementLikes($publicationId);
        if ((int) $publication['utilisateur_id'] !== (int) $userId) {
            (new NotificationModel())->createNotification([
                'auteur_id' => $userId,
                'utilisateur_id' => $publication['utilisateur_id'],
                'publication_id' => $publicationId,
                'type' => 'like',
            ]);
        }
        $updated = $publications->find($publicationId);
        return $this->respondCreated(['message' => 'Like ajouté', 'action' => 'like', 'liked' => true, 'nombre_like_actuel' => (int) $updated['nombre_like']]);
    }

    public function count($publicationId = null)
    {
        return $this->respond(['nombre_de_like' => (new LikeModel())->where('publication_id', $publicationId)->countAllResults()]);
    }
}
