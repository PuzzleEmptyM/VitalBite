import DisclaimerFooter from "./DisclaimerFooter";

const DoAndDont: React.FC = () => {
    const items = ["Item 1", "Item 2", "Item 3", "Item 4"];
  
    return (
      <section className="px-4">
         <div className="relative mb-12">
            <h1 className="text-center text-2xl font-semibold text-forest_green font-playfair">
              Do's and Don'ts
            </h1>
            {/* Horizontal Divider */}
            <div className="w-44 h-[4px] rounded bg-forest_green mx-auto"></div>
          </div>
          {/* content section */}
          <div className="flex justify-center gap-4">
            {/* "Do" Column */}
            <div className="bg-mint shadow-md rounded-3xl p-4 px-2 pb-8 w-48 h-full">
              <h2 className="text-lg text-center font-playfair font-semibold">Do</h2>
              {/* Horizontal Divider */}
              <div className="w-14 h-[4px] rounded bg-forest_green mx-auto mb-4"></div>
              <ul className="space-y-4">
                {items.map((item, index) => (
                  <li key={index} className="flex items-center gap-7 text-forest_green">
                    <span className="text-mint w-10 h-10 bg-cream font-bold font-playfair rounded-full flex items-center justify-center border-2 border-forest_green shadow-md">✔️</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* "Don't" Column */}
            <div className="bg-mint shadow-md rounded-3xl p-4 px-2 pb-8 w-48 h-full">
              <h2 className="text-lg text-center font-semibold font-playfair">Don't</h2>
               {/* Horizontal Divider */}
                <div className="w-16 h-[4px] rounded bg-forest_green mx-auto mb-4"></div>
              <ul className="space-y-4">
                {items.map((item, index) => (
                  <li key={index} className="flex items-center text-forest_green gap-7">
                    <span className="text-mint w-10 h-10 bg-cream font-bold font-playfair rounded-full flex items-center justify-center border-2 border-forest_green shadow-md">❌</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mb-10"></div>
          <DisclaimerFooter />
      </section>
    );
  };
  
  export default DoAndDont;
  