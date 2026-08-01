<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\CommentaireModel;
use App\Models\PublicationModel;
use App\Models\NotificationModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;

class CommentaireController extends BaseController
{
    use ResponseTrait;

    protected $commentaireModel;
    protected $publicationModel;
    protected $notificationModel;

    public function __construct()
    {
        $this->commentaireModel = new CommentaireModel();
        $this->publicationModel = new PublicationModel();
        $this->notificationModel = new NotificationModel();
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