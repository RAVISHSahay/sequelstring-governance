import { useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowLeft,
  ExternalLink,
  Building2,
  Users,
  Target,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  Shield,
  Keyboard,
  Rocket,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HelpArticle,
  HelpCategory,
  helpCategories,
  searchHelp,
  getArticlesByCategory,
  getArticleById,
} from "@/data/helpContent";
import { useNavigate } from "react-router-dom";

interface HelpCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialArticleId?: string;
  initialCategory?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Building2,
  Users,
  Target,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  Shield,
  Keyboard,
};

export function HelpCenter({ open, onOpenChange, initialArticleId, initialCategory }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(
    initialArticleId ? getArticleById(initialArticleId) || null : null
  );
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    return searchHelp(searchQuery);
  }, [searchQuery]);

  const categoryArticles = useMemo(() => {
    return selectedCategory ? getArticlesByCategory(selectedCategory) : [];
  }, [selectedCategory]);

  const handleBack = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
    setSearchQuery("");
  };

  const handleArticleClick = (article: HelpArticle) => {
    setSelectedArticle(article);
    setSearchQuery("");
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedArticle(null);
    setSearchQuery("");
  };

  const handleRelatedTopicClick = (topicId: string) => {
    const article = getArticleById(topicId);
    if (article) {
      setSelectedArticle(article);
    }
  };

  const handleViewFullGuide = () => {
    onOpenChange(false);
    navigate("/user-guide");
  };

  const showBackButton = selectedArticle || selectedCategory;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <SheetTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Help Center
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Search */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-6">
          {/* Search Results */}
          {searchQuery && (
            <div className="space-y-3 pb-6">
              <p className="text-sm text-muted-foreground">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
              {searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No articles found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try different keywords</p>
                </div>
              ) : (
                searchResults.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => handleArticleClick(article)}
                  />
                ))
              )}
            </div>
          )}

          {/* Article Detail */}
          {!searchQuery && selectedArticle && (
            <div className="pb-6">
              <Badge variant="secondary" className="mb-3">
                {helpCategories.find((c) => c.id === selectedArticle.category)?.name}
              </Badge>
              <h2 className="text-xl font-semibold mb-4">{selectedArticle.title}</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.content}
                </p>
              </div>

              {selectedArticle.relatedTopics && selectedArticle.relatedTopics.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Related Topics</h3>
                  <div className="space-y-2">
                    {selectedArticle.relatedTopics.map((topicId) => {
                      const relatedArticle = getArticleById(topicId);
                      return relatedArticle ? (
                        <button
                          key={topicId}
                          onClick={() => handleRelatedTopicClick(topicId)}
                          className="block w-full text-left px-3 py-2 rounded-md text-sm text-primary hover:bg-muted transition-colors"
                        >
                          {relatedArticle.title}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Category Articles */}
          {!searchQuery && selectedCategory && !selectedArticle && (
            <div className="space-y-3 pb-6">
              <h2 className="text-lg font-semibold mb-4">
                {helpCategories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              {categoryArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => handleArticleClick(article)}
                />
              ))}
            </div>
          )}

          {/* Categories */}
          {!searchQuery && !selectedCategory && !selectedArticle && (
            <div className="space-y-3 pb-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">Browse by Category</h2>
              <div className="grid gap-3">
                {helpCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => handleCategoryClick(category.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/50">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleViewFullGuide}
          >
            <ExternalLink className="h-4 w-4" />
            View Full User Guide
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ArticleCard({ article, onClick }: { article: HelpArticle; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
    >
      <h3 className="font-medium text-sm mb-1">{article.title}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2">{article.content}</p>
    </button>
  );
}

function CategoryCard({ category, onClick }: { category: HelpCategory; onClick: () => void }) {
  const Icon = iconMap[category.icon] || BookOpen;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors flex items-start gap-4"
    >
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-medium text-sm mb-1">{category.name}</h3>
        <p className="text-xs text-muted-foreground">{category.description}</p>
      </div>
    </button>
  );
}
