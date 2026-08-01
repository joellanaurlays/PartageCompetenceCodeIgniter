<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Uploads extends BaseConfig
{
    public string $uploadURL = 'http://localhost:8080/uploads/';
    public string $uploadPath = ROOTPATH . 'public/uploads/';
}