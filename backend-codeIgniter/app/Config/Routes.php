<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group('api', static function ($routes) {
    $routes->post('utilisateurs/inscription', 'UserController::register');
    $routes->post('utilisateurs/connexion', 'UserController::login');
    $routes->post('utilisateurs/deconnexion', 'UserController::logout');
    $routes->put('utilisateurs/(:num)', 'UserController::update/$1');
    $routes->put('utilisateurs/(:num)/photo', 'UserController::updatePhoto/$1');
    $routes->post('utilisateurs/modifier-mot-de-passe', 'UserController::changePassword');
    $routes->delete('utilisateurs/(:num)', 'UserController::delete/$1');

    $routes->get('publications/toutes', 'PublicationController::index');
    $routes->get('publications/utilisateur/(:num)', 'PublicationController::byUser/$1');
    $routes->post('publications/creer/(:num)', 'PublicationController::createForUser/$1');
    $routes->put('publications/(:num)', 'PublicationController::update/$1');
    $routes->delete('publications/(:num)', 'PublicationController::delete/$1');

    $routes->post('likes/(:num)/(:num)', 'LikeController::toggle/$1/$2');
    $routes->get('likes/(:num)', 'LikeController::count/$1');

    $routes->get('commentaires/(:num)', 'CommentaireController::byPublication/$1');
    $routes->get('commentaires/nombre/(:num)', 'CommentaireController::count/$1');
    $routes->post('commentaires/(:num)/(:num)', 'CommentaireController::create/$1/$2');
    $routes->put('commentaires/(:num)', 'CommentaireController::update/$1');
    $routes->delete('commentaires/(:num)', 'CommentaireController::delete/$1');

    $routes->get('notifications', 'NotificationController::index');
    $routes->get('notifications/non-lu/count', 'NotificationController::unreadCount');
    $routes->put('notifications/(:num)/lu', 'NotificationController::markRead/$1');
    $routes->put('notifications/lu/tout', 'NotificationController::markAllRead');
});
