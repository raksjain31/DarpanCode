import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
    try {

        const { source_code, language_id, stdin, expected_outputs, problem_id } = req.body;

        const userid = req.user.id;

        //Validate test Cases

        if (

            !Array.isArray(stdin)
            ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length

        ) {
            return res.status(400).json({
                error: "Invalid or Missing Test Cases"
            })

        }

        //2. prepare each test cases for judge0 batch submission

        const submissions = stdin.map((input) => ({

            source_code,
            language_id,
            stdin: input
            // base64_encoded: true,
            // wait: false
        }));

        //3.send batch of summisions to judge0

        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res) => res.token );

        //4. poll judge0 for results of all submissions
        const results = await pollBatchResults(tokens);

        console.log('Result ----')
        console.log(results);

        res.status(200).json({
            message: "Code Executed Successfully"
        })


    } catch (error) {

    }
}