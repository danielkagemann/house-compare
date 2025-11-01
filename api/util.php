<?php

function fetch(string $url, string $method = 'GET', ?array $options = []): array
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));

    // timeout (optional)
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $options['timeout'] ?? 10);
    curl_setopt($ch, CURLOPT_TIMEOUT, $options['timeout'] ?? 30);

    // headers
    $headers = $options['headers'] ?? [];
    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }

    // body
    if (isset($options['body'])) {
        $body = $options['body'];
        // try to convert into json
        if (is_array($body)) {
            $body = json_encode($body);
            $headers[] = 'Content-Type: application/json';
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }

    // execute
    $responseBody = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception("Fetch error: $error");
    }

    curl_close($ch);

    // try to decode json
    $json = null;
    if ($responseBody && str_starts_with(trim($responseBody), '{')) {
        $json = json_decode($responseBody, true);
    }

    return [
        'status' => $status,
        'body' => $responseBody,
        'json' => $json,
    ];
}