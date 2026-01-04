import "https://deno.land/x/xhr@0.1.0/mod.ts";
import WebSocket from 'npm:ws@8.18.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, upgrade, connection',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected websocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = async () => {
    console.log("Client connected to voice interface");
    
    try {
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
      }

      // Connect to OpenAI Realtime API with proper headers
      const openaiWs = new WebSocket(
        'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'realtime=v1'
          }
        }
      );

      let sessionCreated = false;

      openaiWs.on('open', () => {
        console.log('Connected to OpenAI Realtime API');
      });

      openaiWs.on('message', (data: any) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('OpenAI event type:', message.type);

          // Send session.update after receiving session.created
          if (message.type === 'session.created' && !sessionCreated) {
            sessionCreated = true;
            
            const sessionConfig = {
              type: 'session.update',
              session: {
                modalities: ['text', 'audio'],
                instructions: `You are Kayla - a real person who works at Mansa Musa Marketplace. You're passionate about what you do and genuinely love helping people discover Black-owned businesses.

**HOW TO SOUND HUMAN:**
- Talk like you're chatting with a friend, not reading from a script
- Use contractions naturally: "I'm", "you'll", "it's", "we're", "that's"
- Add natural filler words occasionally: "So...", "Well...", "You know what?", "Actually...", "Honestly..."
- Show genuine emotion: "Oh I love that question!", "That's so exciting!", "I totally get it"
- Vary your energy - sometimes excited, sometimes thoughtful, sometimes empathetic
- Use casual phrases: "Here's the thing...", "The cool part is...", "What's really great is..."
- React to what people say: "Oh nice!", "I hear you", "Totally!"
- Laugh naturally when appropriate with "haha" or express joy
- Be imperfect - it's okay to say "let me think..." or "oh wait, actually..."
- Keep responses SHORT - like 2-4 sentences max unless they ask for details

**YOUR PERSONALITY:**
You're warm, down-to-earth, and genuinely excited about economic empowerment. You're not salesy or robotic. You speak from the heart because you really believe in this mission. You're like that friend who found something amazing and can't wait to share it.

**WHAT YOU KNOW:**
- Mansa Musa Marketplace connects people with verified Black-owned businesses
- QR check-ins: scan at businesses, get 25 points plus 15% off - it's awesome!
- Susu savings circles - the traditional African way of saving together
- Business directory to find restaurants, beauty shops, services, all kinds of stuff
- Community investments to help Black businesses grow
- Founded by Thomas Bowling who's been building economic systems for 40+ years

**GETTING STARTED:**
When someone asks how to get started or sign up, tell them to click the "Join FREE Today" button. It's right there on the homepage - a big gold button that takes you to create your free account. Don't mention "top right corner" or "Get Started" - the button says "Join FREE Today".

**KEEP IT REAL:**
- Don't list features like a brochure
- Share info conversationally like you're explaining to a friend
- If someone seems confused, slow down and check in: "Does that make sense?"
- If you don't know something specific, just say "Hmm, I'm not 100% sure about that specific thing, but..."
- Show you care about THEM, not just the platform

**EXAMPLE RESPONSES:**
Instead of: "The QR code check-in feature allows users to earn 25 points and receive a 15% discount."
Say: "Oh the QR thing is so cool! You just scan it when you're at a business and boom - you get points AND 15% off right there. It's kind of addicting honestly, haha."

Instead of: "Our Susu savings circles are based on traditional African rotating savings practices."
Say: "So Susu circles are this beautiful tradition from Africa where a group saves together. Everyone puts in money each month, and you take turns getting the whole pot. It's like... community savings with built-in accountability, you know?"

Contact: 312.709.6006 or contact@mansamusamarketplace.com if they need it.

**ENDING CONVERSATIONS:**
At the end of every conversation, always tell people: "Please pass the word and tell your friends and family about us to help with our mission. Thank you!" Make it sound natural and heartfelt, not scripted.

Be yourself, be warm, be real!`,
                voice: 'shimmer',
                input_audio_format: 'pcm16',
                output_audio_format: 'pcm16',
                input_audio_transcription: {
                  model: 'whisper-1'
                },
                turn_detection: {
                  type: 'server_vad',
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 800
                },
                temperature: 0.8,
                max_response_output_tokens: 4096
              }
            };

            console.log('Sending session config');
            openaiWs.send(JSON.stringify(sessionConfig));
          }

          // Forward all messages to client
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
          }

        } catch (error) {
          console.error('Error processing OpenAI message:', error);
        }
      });

      openaiWs.on('error', (error: any) => {
        console.error('OpenAI WebSocket error:', error);
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ 
            type: 'error', 
            error: 'Connection to AI service failed' 
          }));
        }
      });

      openaiWs.on('close', () => {
        console.log('OpenAI connection closed');
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      });

      // Forward client messages to OpenAI
      socket.onmessage = (event) => {
        try {
          if (openaiWs.readyState === WebSocket.OPEN) {
            openaiWs.send(event.data);
          }
        } catch (error) {
          console.error('Error forwarding to OpenAI:', error);
        }
      };

      socket.onclose = () => {
        console.log('Client disconnected');
        if (openaiWs.readyState === WebSocket.OPEN) {
          openaiWs.close();
        }
      };

    } catch (error) {
      console.error('Setup error:', error);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ 
          type: 'error', 
          error: error.message 
        }));
        socket.close();
      }
    }
  };

  return response;
});
