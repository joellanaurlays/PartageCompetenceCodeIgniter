<?php

namespace App\Controllers;

use App\Models\PublicationModel;
use App\Models\LikeModel;
use App\Models\CommentaireModel;
use App\Models\NotificationModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;

class PublicationController extends BaseController
{
    use ResponseTrait;

    protected $publicationModel;
    protected $likeModel;
    protected $commentaireModel;
    protected $notificationModel;

    public function __construct()
    {
        $this->publicationModel = new PublicationModel();
        $this->likeModel = new LikeModel();
        $this->commentaireModel = new CommentaireModel();
        $this->notificationModel = new NotificationModel();
    }

    // GET /api/publications
    public function index()
    {
        $publications = $this->publicationModel->getAllWithUser();
        return $this->respond($publications);
    }

    // GET /api/publications/{id}
    public function show($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID publication requis');
        }

        $publication = $this->publicationModel->find($id);
        if ($publication === null) {
            return $this->failNotFound('Publication non trouvée');
        }

        $user = $this->publicationModel->getUtilisateur($publication['utilisateur_id']);
        $publication['utilisateur'] = $user;

        return $this->respond($publication);
    }

    // POST /api/publications
    public function create()
    {
        $data = $this->request->getJSON(true);
        $data['date'] = date('Y-m-d');
        
        if (!$this->publicationModel->save($data)) {
            return $this->failValidationErrors($this->publicationModel->errors());
        }

        $publication = $this->publicationModel->find($this->publicationModel->getInsertID());
        return $this->respondCreated($publication);
    }

    // PUT /api/publications/{id}
    public function update($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID publication requis');
        }

        $data = $this->request->getJSON(true);
        $data['id'] = $id;

        if (!$this->publicationModel->find($id)) {
            return $this->failNotFound('Publication non trouvée');
        }

        if (!$this->publicationModel->save($data)) {
            return $this->failValidationErrors($this->publicationModel->errors());
        }

        $publication = $this->publicationModel->find($id);
        return $this->respond($publication);
    }

    // DELETE /api/publications/{id}
    public function delete($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID publication requis');
        }

        if (!$this->publicationModel->find($id)) {
            return $this->failNotFound('Publication non trouvée');
        }

        $this->publicationModel->delete($id);
        return $this->respondDeleted(['message' => 'Publication supprimée avec succès']);
    }

    // POST /api/publications/{id}/like
    public function like($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID publication requis');
        }

        $data = $this->request->getJSON(true);
        $utilisateur_id = $data['utilisateur_id'] ?? null;

        if (!$utilisateur_id) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        // Vérifier si déjà liké (RG4)
        if ($this->likeModel->hasLiked($id, $utilisateur_id)) {
            return $this->failValidationErrors('Vous avez déjà liké cette publication');
        }

        // Ajouter le like
        $likeData = [
            'publication_id' => $id,
            'utilisateur_id' => $utilisateur_id,
            'date' => date('Y-m-d H:i:s')
        ];

        $this->likeModel->insert($likeData);
        
        // Incrémenter le nombre de likes (RG5)
        $this->publicationModel->incrementLikes($id);

        // Créer une notification (RG5)
        $publication = $this->publicationModel->find($id);
        if ($publication && $publication['utilisateur_id'] != $utilisateur_id) {
            $notificationData = [
                'auteur_id' => $utilisateur_id,
                'utilisateur_id' => $publication['utilisateur_id'],
                'publication_id' => $id,
                'type' => 'like',
                'date' => date('Y-m-d H:i:s'),
                'lu' => false
            ];
            $this->notificationModel->createNotification($notificationData);
        }

        return $this->respondCreated([
            'message' => 'Like ajouté avec succès',
            'nombre_like' => $publication['nombre_like'] + 1
        ]);
    }

    // DELETE /api/publications/{id}/unlike
    public function unlike($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID publication requis');
        }

        $data = $this->request->getJSON(true);
        $utilisateur_id = $data['utilisateur_id'] ?? null;

        if (!$utilisateur_id) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        // Vérifier si le like existe
        if (!$this->likeModel->hasLiked($id, $utilisateur_id)) {
            return $this->failNotFound('Like non trouvé');
        }

        // Supprimer le like
        $this->likeModel->where('publication_id', $id)
                        ->where('utilisateur_id', $utilisateur_id)
                        ->delete();

        // Décrémenter le nombre de likes
        $this->publicationModel->decrementLikes($id);

        $publication = $this->publicationModel->find($id);
        return $this->respond([
            'message' => 'Like retiré avec succès',
            'nombre_like' => $publication['nombre_like']
        ]);
    }

    // GET /api/publications/{id}/commentaires
    public function getCommentaires($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID publication requis');
        }

        $commentaires = $this->commentaireModel->getCommentairesWithUser($id);
        
        // Ajouter les réponses pour chaque commentaire
        foreach ($commentaires as &$commentaire) {
            $commentaire['reponses'] = $this->commentaireModel->getReplies($commentaire['id']);
            foreach ($commentaire['reponses'] as &$reponse) {
                $reponse['utilisateur'] = $this->commentaireModel->getUtilisateur($reponse['utilisateur_id']);
            }
        }

        return $this->respond($commentaires);
    }

    // GET /api/publications/{id}/likes
    public function getLikes($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID publication requis');
        }

        $likes = $this->publicationModel->getLikes($id);
        return $this->respond($likes);
    }
}