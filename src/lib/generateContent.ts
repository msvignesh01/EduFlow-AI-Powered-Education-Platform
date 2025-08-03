// Updated to use backend API instead of direct Gemini calls
export const generateContent = async (text: string, outputType: string): Promise<string> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const response = await fetch(`${apiUrl}/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if user is logged in
        ...(localStorage.getItem('access_token') && {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        })
      },
      body: JSON.stringify({
        input_text: text,
        output_type: outputType
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate content');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Content Generation Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate content');
  }
};

