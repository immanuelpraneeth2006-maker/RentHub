import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import EquipmentCard from '../components/EquipmentCard';
import BookingModal from '../components/BookingModal';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Filter,
  X,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Laptops & Computers',
  'Cameras & Photography',
  'Drones',
  'Gaming Consoles',
  'Audio Equipment',
  'Projectors',
  'Printers',
  'Other Electronics',
];

const EquipmentListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('popular');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [page, setPage] = useState(1);

  const [equipments, setEquipments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedForModal, setSelectedForModal] = useState(null);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const urlCat = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    if (urlCat) setCategory(urlCat);
    if (urlSearch !== null && urlSearch !== undefined) setSearchTerm(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 9,
          sort,
        };

        if (category && category !== 'All') params.category = category;
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (availabilityOnly) params.isAvailable = true;

        const res = await api.get('/equipment', { params });
        if (res.data?.data) {
          setEquipments(res.data.data);
          setPagination(res.data.pagination || { page: 1, totalPages: 1, total: res.data.data.length });
        }
      } catch (err) {
        console.error('Error fetching equipment list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [category, searchTerm, minPrice, maxPrice, sort, availabilityOnly, page]);

  const handleResetFilters = () => {
    setCategory('All');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSort('popular');
    setAvailabilityOnly(false);
    setPage(1);
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Browse Equipment Catalog
        </h1>
        <p className="text-sm text-amber-200/70 mt-1">
          Explore and rent pro electronics with instant availability checks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-[#22160f] p-6 rounded-2xl border border-[#3b271a] shadow-lg h-fit sticky top-24 text-white">
          <div className="flex items-center justify-between pb-4 border-b border-[#3b271a]">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <SlidersHorizontal className="w-4 h-4 text-[#e0a96d]" />
              <span>Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#e0a96d] hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200/60 mb-3">Category</h4>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    category === cat
                      ? 'bg-[#9c5221] text-white font-semibold shadow-md shadow-[#9c5221]/30'
                      : 'text-stone-300 hover:bg-[#2c1d14] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200/60 mb-3">
              Daily Price (₹)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
              />
            </div>
          </div>

          {/* Availability Switch */}
          <div className="pt-2 border-t border-[#3b271a]">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-stone-200">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => {
                  setAvailabilityOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 rounded border-[#422d1f] bg-[#180f0a] text-[#9c5221] focus:ring-[#9c5221] cursor-pointer"
              />
              <span>Show Available Gear Only</span>
            </label>
          </div>
        </aside>

        {/* Catalog Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search, Sort and Filter Bar */}
          <div className="bg-[#22160f] p-4 rounded-2xl border border-[#3b271a] shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 text-[#e0a96d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search camera, laptop, model, brand..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-white placeholder-stone-500 text-xs focus:ring-2 focus:ring-[#9c5221] focus:outline-none"
              />
            </form>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#422d1f] text-xs font-semibold text-stone-300 hover:bg-[#2c1d14] cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#e0a96d]" />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-200/70 font-medium whitespace-nowrap">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-[#180f0a] border border-[#422d1f] text-xs font-medium text-white focus:ring-2 focus:ring-[#9c5221] focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills Display */}
          {(category !== 'All' || searchTerm || minPrice || maxPrice || availabilityOnly) && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-amber-200/70 font-medium">Active:</span>
              {category !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2c1d14] text-[#e0a96d] font-medium border border-[#422d1f]">
                  Category: {category}
                  <button onClick={() => setCategory('All')} className="cursor-pointer ml-1 hover:text-white">
                    <X className="w-3 h-3 text-[#e0a96d]" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2c1d14] text-[#e0a96d] font-medium border border-[#422d1f]">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="cursor-pointer ml-1 hover:text-white">
                    <X className="w-3 h-3 text-[#e0a96d]" />
                  </button>
                </span>
              )}
              {availabilityOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2c1d14] text-[#e0a96d] font-medium border border-[#422d1f]">
                  Available Only
                  <button onClick={() => setAvailabilityOnly(false)} className="cursor-pointer ml-1 hover:text-white">
                    <X className="w-3 h-3 text-[#e0a96d]" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-400 hover:text-amber-300 hover:underline font-semibold ml-2 cursor-pointer transition"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Equipment Grid */}
          {loading ? (
            <LoadingSpinner size="lg" text="Searching equipment catalog..." />
          ) : equipments.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipments.map((item) => (
                  <EquipmentCard
                    key={item._id}
                    equipment={item}
                    onQuickBook={(eq) => setSelectedForModal(eq)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          ) : (
            <div className="text-center py-16 bg-[#22160f] rounded-2xl border border-[#3b271a] p-8 space-y-4 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-[#180f0a] border border-[#3b271a] text-[#e0a96d] flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-[#e0a96d]" />
              </div>
              <h3 className="text-lg font-bold text-white">No equipment matches your filters</h3>
              <p className="text-xs text-amber-200/70 max-w-md mx-auto">
                Try loosening your search keywords or resetting price and category filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#9c5221] text-white text-xs font-semibold hover:bg-[#b86328] transition shadow-md shadow-[#9c5221]/30 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedForModal && (
        <BookingModal
          equipment={selectedForModal}
          isOpen={!!selectedForModal}
          onClose={() => setSelectedForModal(null)}
        />
      )}

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm lg:hidden">
          <div className="w-80 max-w-full bg-[#22160f] text-white h-full p-6 flex flex-col justify-between overflow-y-auto border-l border-[#3b271a]">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#3b271a]">
                <h3 className="font-bold text-white text-sm">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="cursor-pointer text-stone-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-200/60 uppercase tracking-wider mb-2">Category</h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setMobileFilterOpen(false);
                        setPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition ${
                        category === cat ? 'bg-[#9c5221] text-white font-semibold' : 'text-stone-300 hover:bg-[#2c1d14]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#3b271a] flex gap-2">
              <button
                onClick={handleResetFilters}
                className="w-1/2 py-2.5 rounded-xl border border-[#422d1f] text-xs font-semibold text-stone-300 hover:bg-[#2c1d14] cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-[#9c5221] text-white text-xs font-semibold hover:bg-[#b86328] cursor-pointer shadow-md shadow-[#9c5221]/30"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentListingPage;
