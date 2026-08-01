<?php

namespace App\Controllers;

use App\Models\CommentaireModel;
use App\Models\NotificationModel;
use App\Models\PublicationModel;
use CodeIgniter\API\ResponseTrait;

class CommentaireController extends BaseController
{
    use ResponseTrait;

    public function byPublication($publicationId = null)
    {
        $model = new CommentaireModel();
        $comments = $model->getCommentairesWithUser($publicationId);
        foreach ($comments as &$comment) {
            $comment['reponses'] = $model->getReplies($comment['id']);
            foreach ($comment['reponses'] as &$reply) {
                $user = $model->getUtilisateur($reply['utilisateur_id']);
                $reply['pseudo'] = $user['pseudo'] ?? '';
                $reply['photo_profil'] = $user['photo_profil'] ?? null;
            }
        }
        return $this->respond($comments);
    }

    public function count($publicationId = null)
    {
        return $this->respond((new CommentaireModel())->where('publication_id', $publicationId)->countAllResults());
    }

    public function create($userId = null, $publicationId = null)
    {
        $body = $this->request->getJSON(true) ?? [];
        $model = new CommentaireModel();
        $data = ['texte' => $body['texte'] ?? '', 'parent_id' => $body['parent_id'] ?? null, 'utilisateur_id' => $userId, 'publication_id' => $publicationId, 'date' => date('Y-m-d H:i:s')];
        if (!$model->insert($data)) {
            return $this->failValidationErrors($model->errors());
        }
        (new PublicationModel())->incrementCommentaires($publicationId);
        $publication = (new PublicationModel())->find($publicationId);
        if ($publication && (int) $publication['utilisateur_id'] !== (int) $userId) {
            (new NotificationModel())->createNotification(['auteur_id' => $userId, 'utilisateur_id' => $publication['utilisateur_id'], 'publication_id' => $publicationId, 'type' => $data['parent_id'] ? 'reply' : 'comment']);
        }
        return $this->respondCreated(['message' => 'Commentaire ajouté', 'commentaire' => $model->getCommentWithUser($model->getInsertID())]);
    }

    public function update($id = null)
    {
        $texte = ($this->request->getJSON(true) ?? [])['texte'] ?? '';
        $model = new CommentaireModel();
        if (!$model->update($id, ['texte' => $texte])) return $this->failValidationErrors($model->errors());
        return $this->respond(['message' => 'Commentaire modifié', 'commentaire' => $model->getCommentWithUser($id)]);
    }

    public function delete($id = null)
    {
        $model = new CommentaireModel();
        $comment = $model->find($id);
        if (!$comment) return $this->failNotFound('Commentaire non trouvé');
        $model->delete($id);
        (new PublicationModel())->decrementCommentaires($comment['publication_id']);
        return $this->respondDeleted(['message' => 'Commentaire supprimé']);
    }
}
