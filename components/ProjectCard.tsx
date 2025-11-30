import React, { useState } from 'react';
import { Project } from '../types';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative border border-[#E5E5E5] bg-[#FAFAFA] group cursor-pointer h-[500px] ${project.gridSpan === 2 ? 'md:col-span-2' : ''}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative w-full h-full overflow-hidden flex flex-col">
        {/* Image Section */}
        <div className="relative h-3/4 w-full overflow-hidden border-b border-[#E5E5E5]">
             <motion.img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover filter grayscale contrast-100 brightness-110 group-hover:grayscale-0 transition-all duration-700 ease-out"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            />
            
            {/* White overlay instead of color */}
            <div className={`absolute inset-0 bg-white mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
        </div>

        {/* Content Section - Light Theme */}
        <div className="h-1/4 p-6 bg-[#FFFFFF] flex flex-col justify-center relative group-hover:bg-[#000000] transition-colors duration-300">
             <div className="flex justify-between items-start">
                 <div>
                    <span className="inline-block text-[#666] group-hover:text-white/60 text-xs font-mono tracking-widest mb-2 font-bold uppercase transition-colors">
                        {project.category}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold leading-none uppercase truncate text-black group-hover:text-white transition-colors font-['Space_Grotesk']">
                        {project.title}
                    </h3>
                 </div>
                 <motion.div 
                    animate={isHovered ? { rotate: 45, x: 2, y: -2 } : { rotate: 0, x: 0, y: 0 }}
                    className="text-black group-hover:text-white transition-colors"
                 >
                    <ArrowUpRight size={32} />
                 </motion.div>
             </div>
        </div>
      </div>

      {/* Decorative ID */}
      <div className="absolute top-4 left-4 text-black mix-blend-difference text-lg pixel-font font-bold z-10 opacity-30">
        #{project.id < 10 ? `0${project.id}` : project.id}
      </div>
    </motion.div>
  );
};

export default ProjectCard;