<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;

class UserController extends BaseController
{
    use ResponseTrait;

    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    // GET /api/users
    public function index()
    {
        $users = $this->userModel->findAll();
        return $this->respond($users);
    }

    // GET /api/users/{id}
    public function show($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        $user = $this->userModel->find($id);
        if ($user === null) {
            return $this->failNotFound('Utilisateur non trouvé');
        }

        // Ne pas retourner le mot de passe
        unset($user['mot_de_passe']);
        return $this->respond($user);
    }

    // POST /api/users
    public function create()
    {
        $data = $this->request->getJSON(true);
        
        if (!$this->userModel->save($data)) {
            return $this->failValidationErrors($this->userModel->errors());
        }

        $user = $this->userModel->find($this->userModel->getInsertID());
        unset($user['mot_de_passe']);
        
        return $this->respondCreated($user);
    }

    // PUT /api/users/{id}
    public function update($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        $data = $this->request->getJSON(true);
        $data['id'] = $id;

        if (!$this->userModel->save($data)) {
            return $this->failValidationErrors($this->userModel->errors());
        }

        $user = $this->userModel->find($id);
        unset($user['mot_de_passe']);
        
        return $this->respond($user);
    }

    // DELETE /api/users/{id}
    public function delete($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        if (!$this->userModel->find($id)) {
            return $this->failNotFound('Utilisateur non trouvé');
        }

        $this->userModel->delete($id);
        return $this->respondDeleted(['message' => 'Utilisateur supprimé avec succès']);
    }

    // GET /api/users/{id}/publications
    public function getPublications($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        $publications = $this->userModel->getPublications($id);
        return $this->respond($publications);
    }

    // GET /api/users/{id}/notifications
    public function getNotifications($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors('ID utilisateur requis');
        }

        $notifications = $this->userModel->getNotifications($id);
        return $this->respond($notifications);
    }

    // POST /api/login
    public function login()
    {
        $data = $this->request->getJSON(true);
        
        $email = $data['email'] ?? null;
        $password = $data['mot_de_passe'] ?? null;

        if (!$email || !$password) {
            return $this->failValidationErrors('Email et mot de passe requis');
        }

        $user = $this->userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['mot_de_passe'])) {
            return $this->failUnauthorized('Identifiants invalides');
        }

        unset($user['mot_de_passe']);
        
        // À ajouter : création de token JWT si nécessaire
        return $this->respond([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => 'votre_token_jwt_ici' // À implémenter
        ]);
    }
}