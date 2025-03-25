import React, { useState, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { AnalystQuestion } from '../types';

interface AnalystCarouselProps {
  data: AnalystQuestion[];
}

export const AnalystCarousel: React.FC<AnalystCarouselProps> = ({ data }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(item => 
      item.question.toLowerCase().includes(query) ||
      item.analyst.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(0);
    }
  }, [filteredData, emblaApi]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative h-full flex flex-col">
      <div className="mb-2 relative">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <Search size={14} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search questions or analysts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </div>

      <div className="overflow-hidden flex-1" ref={emblaRef}>
        <div className="flex h-full">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative h-full"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="flex-1 min-h-0">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {item.question}
                  </p>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">{item.analyst}</span>
                    <span className="text-gray-500">{item.quarter} {item.year}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Net:</span>
                      <span className={item.netPositivity >= item.netNegativity ? 'text-green-600' : 'text-red-600'}>
                        {(item.netPositivity - item.netNegativity).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Δ:</span>
                      <span className={item.stockChangeNextDay >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {item.stockChangeNextDay.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1">
        <button
          onClick={scrollPrev}
          className="p-0.5 rounded hover:bg-gray-100 transition-colors"
          aria-label="Previous question"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-0.5">
          {filteredData.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === selectedIndex
                  ? 'bg-gray-800'
                  : 'bg-gray-300'
              }`}
              aria-label={`Go to question ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="p-0.5 rounded hover:bg-gray-100 transition-colors"
          aria-label="Next question"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};