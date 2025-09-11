import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { grades, studentName } = await request.json();

        // Validate input
        if (!grades || typeof grades !== 'object' || Object.keys(grades).length === 0) {
            return NextResponse.json(
                { error: 'Invalid or missing grades data' },
                { status: 400 }
            );
        }

        if (!studentName || typeof studentName !== 'string') {
            return NextResponse.json(
                { error: 'Invalid or missing student name' },
                { status: 400 }
            );
        }

        // Check for OpenAI API key
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        // Calculate average grade and identify strengths
        const gradeValues = Object.values(grades);
        const averageGrade = gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length;

        // Find strongest subjects (above average)
        const strongSubjects = Object.entries(grades)
            .filter(([, grade]) => grade >= averageGrade)
            .sort(([, a], [, b]) => b - a)
            .map(([subject]) => subject);

        // Create structured prompt for career recommendation
        const prompt = `You are a career counselor for computer science students. Based on the following academic performance, provide a comprehensive career recommendation in exactly 2-3 paragraphs.

Student: ${studentName}
Academic Performance:
${Object.entries(grades).map(([subject, grade]) => `- ${subject}: ${grade}%`).join('\n')}

Average Grade: ${averageGrade.toFixed(1)}%
Strongest Subjects: ${strongSubjects.join(', ')}

Please provide:
1. First paragraph: Analysis of their academic strengths and what these grades indicate about their aptitude
2. Second paragraph: Specific career paths that align with their performance (be specific about roles like Software Engineer, Data Scientist, etc.)
3. Third paragraph: Actionable next steps and recommendations for skill development

Keep the tone encouraging and professional. Focus on computer science and technology careers. Be specific about career paths rather than generic advice.`;

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert career counselor specializing in computer science and technology careers. Provide specific, actionable career advice based on academic performance.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenAI API error:', response.status, errorData);

            if (response.status === 401) {
                return NextResponse.json(
                    { error: 'Invalid OpenAI API key' },
                    { status: 500 }
                );
            }

            if (response.status === 429) {
                return NextResponse.json(
                    { error: 'OpenAI API rate limit exceeded. Please try again later.' },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: 'Failed to get recommendation from OpenAI' },
                { status: 500 }
            );
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            return NextResponse.json(
                { error: 'Invalid response from OpenAI' },
                { status: 500 }
            );
        }

        const recommendation = data.choices[0].message.content.trim();

        return NextResponse.json({
            recommendation,
            metadata: {
                averageGrade: averageGrade.toFixed(1),
                strongSubjects,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error in OpenAI API route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}