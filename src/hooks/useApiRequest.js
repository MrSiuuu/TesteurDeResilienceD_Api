import { useState } from 'react';
import { proofOfWork } from '../utils/pow'; 

const useApiRequest = () => {
    const [stats, setStats] = useState({
        totalRequests: 0,
        successes: 0,
        failures: 0,
        avgResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        successRate: 0,
    });

    const [responses, setResponses] = useState([]);

    const sendRequests = async (url, numRequests, method = 'POST', body = null) => {
        let successes = 0;
        let failures = 0;
        let totalResponseTime = 0;
        let minResponseTime = Infinity;
        let maxResponseTime = 0;
        let collectedResponses = [];
        let powResult = null; 

        for (let i = 0; i < numRequests; i++) {
            try {
                const challenge = "test"; 
                const pow = await proofOfWork(challenge, 3); 

                if (!powResult) {
                    powResult = pow; 
                }

                const startTime = Date.now();

                const options = {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-PoW-Nonce': pow.nonce,
                        'X-PoW-Hash': pow.hash,
                    },
                };

                if (method === 'POST' && body) {
                    options.body = JSON.stringify(body);
                }

                const response = await fetch(url, options);
                const endTime = Date.now();

                const timeTaken = endTime - startTime;
                totalResponseTime += timeTaken;

                
                if (timeTaken < minResponseTime) minResponseTime = timeTaken;
                if (timeTaken > maxResponseTime) maxResponseTime = timeTaken;

                const data = await response.json().catch(() => response.text());

                if (response.ok) {
                    successes++;
                } else {
                    failures++;
                    
                }

                collectedResponses.push({
                    status: response.status,
                    time: timeTaken,
                    data,
                });
            } catch (error) {
                failures++;
                collectedResponses.push({
                    status: 'PoW/Error',
                    time: 0,
                    data: error.message,
                });
            }
        }

        const avgResponseTime = numRequests ? (totalResponseTime / numRequests).toFixed(2) : 0;
        const successRate = numRequests ? ((successes / numRequests) * 100).toFixed(2) : 0;

        setStats({
            totalRequests: numRequests,
            successes,
            failures,
            avgResponseTime,
            minResponseTime: minResponseTime === Infinity ? 0 : minResponseTime,
            maxResponseTime,
            successRate,
        });

        setResponses(collectedResponses);

        return powResult; 
    };

    return { sendRequests, stats, responses };
};

export default useApiRequest;