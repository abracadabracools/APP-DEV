import { useState } from "react"; // Import useState hook to manage dynamic state
import { Button, Text, View } from "react-native"; // Import core UI components: View, Text, Button

export default function App() {             // Main App component
  const [count, setCount] = useState(0);    // Declare state variable "count" initialized to 0

  return (                                  // Return the UI
    <View                                   // Container for all elements
      style={{                              // Inline styles for the container
        flex: 1,                             // Fill the whole screen
        justifyContent: "center",            // Center children vertically
        alignItems: "center",                // Center children horizontally
      }}                                     // End of style
    >
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        You clicked {count} times           {/* Display the dynamic counter */}
      </Text>
      <Button 
        title="Click Me"                     // Button label
        onPress={() => setCount(count + 1)} // Increment counter when pressed
      />                                     
    </View>                                  
  );                                         
}                                            
