import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Thought {
  timestamp: string;
  name: string;
  message: string;
}

interface ThoughtsDisplayProps {
  refreshTrigger?: number; // Not used anymore, but kept for compatibility
}

const ThoughtsDisplay = ({ refreshTrigger }: ThoughtsDisplayProps) => {
  // Static thoughts - manually added (more thoughts for pagination demo)
  const staticThoughts: Thought[] = [
   /* {
      timestamp: "",
      name: "",
      message: ""
    },
    {
      timestamp: "",
      name: "",
      message: ""
    },
  */
  ];

  const [thoughts] = useState<Thought[]>(staticThoughts);
  const [currentPage, setCurrentPage] = useState(0);
  const thoughtsPerPage = 3;
  
  // Calculate pagination
  const totalPages = Math.ceil(thoughts.length / thoughtsPerPage);
  const startIndex = currentPage * thoughtsPerPage;
  const endIndex = startIndex + thoughtsPerPage;
  const currentThoughts = thoughts.slice(startIndex, endIndex);
  
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h4 className="text-lg font-serif font-light text-foreground">
          Recent Thoughts ({thoughts.length})
        </h4>
        <p className="text-xs text-muted-foreground mt-1">
          Page {currentPage + 1} of {totalPages}
        </p>
      </div>
      
      <div className="grid gap-4">
        {currentThoughts.map((thought, index) => (
          <div 
            key={`${thought.timestamp}-${index}`}
            className="bg-white/50 backdrop-blur-sm border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium text-foreground">
                {thought.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(thought.timestamp)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {thought.message}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-8 h-8 rounded-full text-sm transition-colors ${
                  currentPage === i
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ThoughtsDisplay;


