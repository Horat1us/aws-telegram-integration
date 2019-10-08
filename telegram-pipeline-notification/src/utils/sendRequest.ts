import * as https from "https";

type Response<TResult = any> = {
    ok: false;
    error_code: number;
    description: string;
} | {
    ok: true,
    result: TResult;
}

const isResponse = (response: Response): response is Response => ("ok" in response)
    && (
        ("result" in response)
        || ("description" in response)
    );

export async function sendRequest<TResult>(url: URL): Promise<Response<TResult>> {
    const body = await new Promise<string>((resolve, reject) => {
        const req = https.request(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.end();
    });
    const response = JSON.parse(body);
    if (!isResponse(response)) {
        throw new Error(`Invalid Response: ${body}`);
    }
    return response;
}
