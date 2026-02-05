import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthQuery';
import {
    Channel,
    ChannelHeader,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader';
import CallButton from '../components/CallButton';
import useStreamToken from '../hooks/useStreamToken';
import 'stream-chat-react/dist/css/v2/index.css';

const API_KEY = import.meta.env.VITE_STREAM_API_KEY || 'your-stream-api-key';

const ChatPage = () => {
    const { id: targetUserId } = useParams();
    const navigate = useNavigate();
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const { data: authData } = useAuthStatus();
    const authUser = authData?.user;
    const { data: tokenData } = useStreamToken(authUser);

    useEffect(() => {
        const initChat = async () => {
            if (!tokenData?.token || !authUser || !targetUserId) {
                setLoading(false);
                return;
            }

            try {
                console.log("Initializing stream chat client...");
                const client = StreamChat.getInstance(API_KEY);
                
                await client.connectUser({
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePicture || undefined
                }, tokenData.token);

                // Create channel ID by sorting user IDs to ensure consistency
                const channelId = [authUser._id, targetUserId].sort().join("-");
                const currentChannel = client.channel("messaging", channelId, {
                    members: [authUser._id, targetUserId],
                    name: `Chat between ${authUser.fullName} and client/advocate`
                });

                await currentChannel.watch();
                setChatClient(client);
                setChannel(currentChannel);
            } catch (error) {
                console.error("Error initializing chat: ", error);
                toast.error("Could not connect to chat. Please try again");
            } finally {
                setLoading(false);
            }
        };

        initChat();

        // Cleanup function
        return () => {
            if (chatClient) {
                chatClient.disconnectUser();
            }
        };
    }, [tokenData, authUser, targetUserId]);

    const handleVideoCall = () => {
        if (channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;
            channel.sendMessage({
                text: `🎥 I've started a video call. Join me here: ${callUrl}`,
                attachments: [{
                    type: 'video_call',
                    title: 'Video Call Invitation',
                    title_link: callUrl,
                    text: 'Click to join the video call'
                }]
            });
            toast.success("Video call link sent successfully!");
            
            // Navigate to call page
            navigate(`/call/${channel.id}`);
        }
    };

    const handleEndChat = async () => {
        try {
            if (chatClient) {
                await chatClient.disconnectUser();
            }
        } catch (error) {
            console.error('Error ending chat:', error);
        } finally {
            const role = authUser?.role;
            navigate(role === 'advocate' ? '/advocate/dashboard' : '/client/dashboard');
        }
    };

    if (loading || !chatClient || !channel) return <ChatLoader />;

    return (
        <div className="h-[93vh] bg-gray-50">
            <Chat client={chatClient} theme="str-chat__theme-light">
                <Channel channel={channel}>
                    <div className="w-full h-full flex flex-col">
                        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-200">
                            <div className="flex items-center justify-between px-4 py-3">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-800">Chat</span>
                                    <span className="text-xs text-gray-500">Secure conversation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleVideoCall}
                                        className="text-xs px-3 py-1.5 rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors"
                                    >
                                        Start Video Call
                                    </button>
                                    <button
                                        onClick={handleEndChat}
                                        className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        End Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                        <Window className="flex-1 min-h-0">
                            <ChannelHeader />
                            <MessageList className="bg-gray-50 px-3 sm:px-4" />
                            <div className="bg-white border-t border-gray-200 px-2 sm:px-3 py-2">
                                <MessageInput focus />
                            </div>
                        </Window>
                    </div>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    );
};

export default ChatPage;