<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
class Cors extends BaseConfig
{
    /**
     * The default CORS configuration.
     *
     * @var array{
     *      allowedOrigins: list<string>,
     *      allowedOriginsPatterns: list<string>,
     *      supportsCredentials: bool,
     *      allowedHeaders: list<string>,
     *      exposedHeaders: list<string>,
     *      allowedMethods: list<string>,
     *      maxAge: int,
     *  }
     */
    public array $default = [
        /**
         * Origines autorisées pour l'en-tête `Access-Control-Allow-Origin`.
         * Ajoutez ici l'URL de votre frontend React.
         *
         * E.g.: Create React App -> http://localhost:3000
         *       Vite             -> http://localhost:5173
         */
        'allowedOrigins' => [
            'http://localhost:3000',
            'http://localhost:5173',
        ],

        /**
         * Origin regex patterns for the `Access-Control-Allow-Origin` header.
         */
        'allowedOriginsPatterns' => [],

        /**
         * Autorise l'envoi de cookies / headers Authorization en cross-origin.
         */
        'supportsCredentials' => true,

        /**
         * Headers autorisés dans les requêtes du frontend.
         */
        'allowedHeaders' => ['Content-Type', 'Authorization', 'X-Requested-With'],

        /**
         * Headers exposés au frontend dans la réponse.
         */
        'exposedHeaders' => [],

        /**
         * Méthodes HTTP autorisées.
         */
        'allowedMethods' => ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

        /**
         * Durée de mise en cache du preflight (en secondes).
         */
        'maxAge' => 7200,
    ];
}