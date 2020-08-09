<?php

/**
 * Uploads a file
 * 
 * @param array $file Associative array containing data about a file
 * 
 * @return boolean true if it uploaded correctly, otherwise false
 */
function upload($file) {
    
    if($file['error'] == UPLOAD_ERR_OK && $file['size'] < 2000000){
        if(move_uploaded_file($file['tmp_name'], './uploads/' . $file['name'])) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}