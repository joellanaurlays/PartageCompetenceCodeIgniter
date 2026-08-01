<?php

namespace App\Controllers;

<<<<<<< HEAD
use App\Controllers\BaseController;
use App\Models\CommentaireModel;
use App\Models\PublicationModel;
use App\Models\NotificationModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
=======
use App\Models\CommentaireModel;
use App\Models\NotificationModel;
use App\Models\PublicationModel;
use CodeIgniter\API\ResponseTrait;
>>>>>>> 002bc163ab0885299ac994c5f3c456ba77cfe474

class CommentaireController extends BaseController
{
    use ResponseTrait;

<<<<<<< HEAD
    protected $commentaireModel;
    protected $publicationModel;
    protected $notificationModel;

    public function __construct()
    {
        $this->commentaireModel = new CommentaireModel();
        $this->publicationModel = new PublicationModel();
        $this->notificationModel = new NotificationModel();
=======
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
>>>>>>> 002bc163ab0885299ac994c5f3c456ba77cfe474
    }

    /**
     * GET /api/publications/{id}/commentaires
     */
    public function getByPublication($publicationId = null)
    {
        if ($publicationId === null) {
            return $this->failValidationErrors('ID publication requis');
        }

        $publication = $this->publicationModel->find($publicationId);
        if ($publication === null) {
            return $this->failNotFound('Publication non trouvée');
        }

        $commentaires = $this->commentaireModel->getCommentairesWithUser($publicationId);
        
        // Ajouter les réponses pour chaque commentaire
        foreach ($commentaires as &$commentaire) {
            $commentaire['reponses'] = $this->commentaireModel->getReplies($commentaire['id']);
            foreach ($commentaire['reponses'] as &$reponse) {
                $reponse['utilisateur'] = $this->commentaireModel->getUtilisateur($reponse['utilisateur_id']);
            }
        }

        return $this->respond($commentaires);
    }

    /**
     * POST /api/commentaires
     */
    public function create()
    {
        $data = $this->request->getJSON(true);
        $data['date'] = date('Y-m-d H:i:s');

        // Vérifier si la publication existe
        $publication = $this->publicationModel->find($data['publication_id'] ?? null);
        if (!$publication) {
            return $this->failNotFound('Publication non trouvée');
        }

        if (!$this->commentaireModel->save($data)) {
            return $this->failValidationErrors($this->commentaireModel->errors());
        }

        // Incrémenter le nombre de commentaires
        $this->publicationModel->incrementCommentCount($data['publication_id']);

        // Créer une notification (RG5)
        if ($publication['utilisateur_id'] != $data['utilisateur_id']) {
            $notificationData = [
                'auteur_id' => $data['utilisateur_id'],
                'utilisateur_id' => $publication['utilisateur_id'],
                'publication_id' => $data['publication_id'],
                'type' => 'commentaire',
                'date' => date('Y-m-d H:i:s'),
                'lu' => false
            ];
            $this->notificationModel->createNotification($notificationData);
        }

        $commentaire = $this->commentaireModel->find($this->commentaireModel->getInsertID());
        return $this->respondCreated($commentaire);
    }

    /**
     * PUT /api/commentaires/{id}
     */
    public function update($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID commentaire requis');
        }

        $data = $this->request->getJSON(true);
        $data['id'] = $id;

        if (!$this->commentaireModel->find($id)) {
            return $this->failNotFound('Commentaire non trouvé');
        }

        if (!$this->commentaireModel->save($data)) {
            return $this->failValidationErrors($this->commentaireModel->errors());
        }

        $commentaire = $this->commentaireModel->find($id);
        return $this->respond($commentaire);
    }

    /**
     * DELETE /api/commentaires/{id}
     */
    public function delete($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID commentaire requis');
        }

        $commentaire = $this->commentaireModel->find($id);
        if (!$commentaire) {
            return $this->failNotFound('Commentaire non trouvé');
        }

        $publication_id = $commentaire['publication_id'];
        
        $this->commentaireModel->delete($id);

        // Décrémenter le nombre de commentaires
        $this->publicationModel->set('nombre_commentaire', 'nombre_commentaire - 1', false)
                              ->where('id', $publication_id)
                              ->update();

        return $this->respondDeleted(['message' => 'Commentaire supprimé avec succès']);
    }

    /**
     * GET /api/commentaires/{id}/reponses
     */
    public function getReplies($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID commentaire requis');
        }

        if (!$this->commentaireModel->find($id)) {
            return $this->failNotFound('Commentaire non trouvé');
        }

        $reponses = $this->commentaireModel->getReplies($id);
        
        // Ajouter les infos utilisateur pour chaque réponse
        foreach ($reponses as &$reponse) {
            $reponse['utilisateur'] = $this->commentaireModel->getUtilisateur($reponse['utilisateur_id']);
        }

        return $this->respond($reponses);
    }
}