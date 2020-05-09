exports.E_NOT_FOUND = 'https://petsitter.example.com/probs/not-found';
exports.E_UNAUTHORIZED = 'https://petsitter.example.com/probs/unauthorized';
exports.E_FORBIDDEN = 'https://petsitter.example.com/probs/forbidden';
exports.E_SERVER_FAULT = 'https://petsitter.example.com/probs/server-fault';

exports.Problem = class Problem extends Error {
    
    constructor(type, title) {
        super();
        this.title = title;
        this.type = type;
    }

    toResponse(response) {
        let code = 500;

        switch (this.type) {
            case exports.E_NOT_FOUND:
                code = 404;
                break;
            case exports.E_UNAUTHORIZED:
                code = 401;
                break;
            case exports.E_FORBIDDEN:
                code = 403;
                break;
        }

        // Payload according to: https://tools.ietf.org/html/rfc7807
        const payload = {
            type : this.type,
            title : this.title
        };
        response.writeHead(code, { 'Content-Type': 'application/problem+json' });
        response.end(JSON.stringify(payload));
    }

}