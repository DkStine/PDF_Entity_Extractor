export default ({ file, entities }) => {
     const [previewUrl, setPreviewUrl] = useState("");
     
    useEffect(() => {
       if (file) {
         const url = URL.createObjectURL(file);
         setPreviewUrl(url);
         return () => URL.revokeObjectURL(url);
       }
     }, [file]);
     
     return (
       <div className="relative">
         <img src={previewUrl} alt="Preview" className="border" />
         {entities.names.map((name, i) => (
           <div key={i} className="absolute border-2 border-green-500 animate-pulse"
                style={{ top: name.position.y, left: name.position.x }}>
             {name.text}
           </div>
         ))}
       </div>
     );
   };

   