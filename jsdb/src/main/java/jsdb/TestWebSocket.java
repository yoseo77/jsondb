package jsdb;

import java.io.IOException;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.RemoteEndpoint.Basic;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

//@Controller("TestWebSocketController")
//@RequestMapping(value = "Test")
@ServerEndpoint(value="/chat")
public class TestWebSocket {
	//http://www.websocket.org/echo.html
    private static final java.util.Set<Session> sessions = java.util.Collections.synchronizedSet(new java.util.HashSet<Session>());
    
    /**
     * @OnOpen allows us to intercept the creation of a new session.
     * The session class allows us to send data to the user.
     * In the method onOpen, we'll let the user know that the handshake was 
     * successful.
     */
    @OnOpen
    public void onOpen(Session session){
        System.out.println("Open session id : " + session.getId());
        
        try {
            final Basic basic = session.getBasicRemote();
            basic.sendText("Connection Established");
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
        
        sessions.add(session);
    }
    
    /**
     * 모든 사용자에게 메시지를 전달한다.
     * @param self
     * @param message
     */
    private void sendAllSessionToMessage(Session self, String message){
        try {
            for( Session session : TestWebSocket.sessions ){
                if( ! self.getId().equals(session.getId()) )
                    session.getBasicRemote().sendText("All : " + message);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * When a user sends a message to the server, this method will intercept the message
     * and allow us to react to it. For now the message is read as a String.
     */
    @OnMessage
    public void onMessage(String message, Session session){
        System.out.println("Message from " + session.getId() + ": " + message);
        try {
            final Basic basic = session.getBasicRemote();
            basic.sendText("to : " + message);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        
        sendAllSessionToMessage( session, message );
    }
    
    @OnError
    public void onError( Throwable e, Session session){
        
    }
    
    /**
     * The user closes the connection.
     * 
     * Note: you can't send messages to the client from this method
     */
    @OnClose
    public void onClose(Session session){
        System.out.println("Session " +session.getId()+" has ended");
        sessions.remove(session);
    }
	
	
//    /***
//     * 웹 소켓이 연결되면 호출되는 이벤트
//     */
//    @OnOpen
//    public void handleOpen(){
//        System.out.println("client is now connected...");
//    }
//    /**
//     * 웹 소켓으로부터 메시지가 오면 호출되는 이벤트
//     * @param message
//     * @return
//     */
//    @OnMessage
//    public String handleMessage(String message){
//        System.out.println("receive from client : "+message);
//        String replymessage = "echo "+message;
//        System.out.println("send to client : "+replymessage);
//        return replymessage;
//    }
//    /**
//     * 웹 소켓이 닫히면 호출되는 이벤트
//     */
//    @OnClose
//    public void handleClose(){
//        System.out.println("client is now disconnected...");
//    }
//    /**
//     * 웹 소켓이 에러가 나면 호출되는 이벤트
//     * @param t
//     */
//    @OnError
//    public void handleError(Throwable t){
//        t.printStackTrace();
//    }

//
//@ServerEndpoint("/broadcasting")
//public class Broadsocket {
//
//	private static Set<Session> clients = Collections
//			.synchronizedSet(new HashSet<Session>());
//
//	@OnMessage
//	public void onMessage(String message, Session session) throws IOException {
//		System.out.println(message);
//		synchronized (clients) {
//			// Iterate over the connected sessions
//			// and broadcast the received message
//			for (Session client : clients) {
//				if (!client.equals(session)) {
//					client.getBasicRemote().sendText(message);
//				}
//			}
//		}
//	}
//
//	@OnOpen
//	public void onOpen(Session session) {
//		// Add session to the connected sessions set
//		System.out.println(session);
//		clients.add(session);
//	}
//
//	@OnClose
//	public void onClose(Session session) {
//		// Remove session from the connected sessions set
//		clients.remove(session);
//	}
}
