import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";
import {
  clearFilters,
  setOrderBy,
  setSearchTerm,
  setSelectedBrands,
  setSelectedTypes,
  type SortOption,
} from "./catalogSlice";
import { useGetFiltersQuery } from "./catalogApi";

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import { AnimatePresence, motion } from "framer-motion";

type DraftFilters = {
  brands: string[];
  types: string[];
};

type Props = {
  category: string;
};

export default function CatalogControls({ category }: Props) {
  const dispatch = useDispatch();

  const { businessType, searchTerm, orderBy, selectedBrands, selectedTypes } =
    useSelector((state: RootState) => state.catalog);

  // ✅ Local input (does NOT trigger search until you submit)
  const [searchInput, setSearchInput] = useState(searchTerm);

  // ✅ Scoped filters should be based on COMMITTED searchTerm (not input)
  const { data: filtersData, isLoading: isLoadingFilters } =
    useGetFiltersQuery({
      category,
      businessType,
      searchTerm: searchTerm.trim() || undefined,
    });

  const [open, setOpen] = useState(false);

  // Draft filters only inside the drawer
  const [draft, setDraft] = useState<DraftFilters>({
    brands: selectedBrands,
    types: selectedTypes,
  });

  // Badge ONLY counts real filters
  const filterCount = useMemo(
    () => selectedBrands.length + selectedTypes.length,
    [selectedBrands.length, selectedTypes.length]
  );

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  const openFilters = () => {
    setDraft({ brands: selectedBrands, types: selectedTypes });
    setOpen(true);
  };

  const closeFilters = () => setOpen(false);

  const applyFilters = () => {
    dispatch(setSelectedBrands(draft.brands));
    dispatch(setSelectedTypes(draft.types));
    setOpen(false);
  };

  // ✅ Search only on explicit action
  const submitSearch = () => {
    dispatch(setSearchTerm(searchInput.trim()));
  };

  const clearSearch = () => {
    setSearchInput("");
    dispatch(setSearchTerm(""));
  };

  const clearAll = () => {
    setSearchInput("");
    dispatch(clearFilters());
    setDraft({ brands: [], types: [] });
  };

  const sortLabel =
    orderBy === "price"
      ? "Sort: Price ↑"
      : orderBy === "priceDesc"
      ? "Sort: Price ↓"
      : "";

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "#f3f4f6",
          pt: 0.75,
          pb: 1.25,
        }}
      >
        {/* Search (button appears after first letter) */}
<Box
  sx={{
    bgcolor: "#fff",
    borderRadius: 999,
    px: 1,
    py: 0.75,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
    display: "flex",
    alignItems: "center",
    gap: 1,
  }}
>
  {/* Icon */}
  <Box sx={{ pl: 0.75, display: "flex", alignItems: "center" }}>
    <SearchIcon sx={{ color: "text.secondary" }} />
  </Box>

  {/* Input */}
  <TextField
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") submitSearch();
    }}
    placeholder="Search products..."
    variant="standard"
    fullWidth
    InputProps={{
      disableUnderline: true,
      sx: {
        fontSize: 14,
        fontWeight: 700,
        px: 0.5,
        py: 0.25,
        "& input::placeholder": {
          opacity: 1,
          color: "#9ca3af",
          fontWeight: 700,
        },
      },
    }}
  />

  {/* Right controls */}
  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ pr: 0.5 }}>
    {/* Clear X */}
    <AnimatePresence>
      {searchInput.trim().length > 0 && (
        <motion.div
          key="clear"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <IconButton
            size="small"
            onClick={clearSearch}
            sx={{
              width: 34,
              height: 34,
              borderRadius: 999,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "#fff",
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Search button appears after first letter */}
    <AnimatePresence>
      {searchInput.trim().length > 0 && (
        <motion.div
          key="searchBtn"
          initial={{ opacity: 0, x: 10, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 160, damping: 28, mass: 1.1 }}
        >
          <Button
            onClick={submitSearch}
            variant="contained"
            disableElevation
            sx={{
              borderRadius: 999,
              px: 2.2,
              height: 36,
              textTransform: "none",
              fontWeight: 900,
              bgcolor: "#ef4444",
              "&:hover": { bgcolor: "#dc2626" },
              boxShadow: "0 10px 22px rgba(239, 68, 68, 0.25)",
            }}
          >
            Search
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  </Stack>
</Box>


        {/* Sort + Filters */}
        <Stack direction="row" spacing={1.25} sx={{ mt: 1.25 }}>
          <Box
            sx={{
              flex: 1,
              bgcolor: "#fff",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              px: 1.25,
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 800 }}>
              Sort
            </Typography>

            <FormControl size="small">
              <Select
                value={orderBy}
                onChange={(e) =>
                  dispatch(setOrderBy(e.target.value as SortOption))
                }
                sx={{
                  minWidth: 170,
                  borderRadius: 2,
                  fontSize: 13,
                }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="price">Price: Low → High</MenuItem>
                <MenuItem value="priceDesc">Price: High → Low</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            onClick={openFilters}
            variant="outlined"
            sx={{
              width: 140,
              bgcolor: "#fff",
              borderColor: "divider",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 900,
              justifyContent: "space-between",
              px: 1.25,
            }}
            endIcon={
              <Badge
                badgeContent={filterCount}
                color="error"
                invisible={filterCount === 0}
                sx={{
                  "& .MuiBadge-badge": {
                    fontWeight: 900,
                    minWidth: 18,
                    height: 18,
                  },
                }}
              >
                <TuneIcon />
              </Badge>
            }
          >
            Filters
          </Button>
        </Stack>

        {/* Chips */}
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
          {!!sortLabel && (
            <Chip
              size="small"
              label={sortLabel}
              onDelete={() => dispatch(setOrderBy("name"))}
              sx={{ fontWeight: 800 }}
            />
          )}

          {searchTerm.trim() && (
            <Chip
              size="small"
              label={`Search: ${searchTerm.trim()}`}
              onDelete={clearSearch}
              sx={{ fontWeight: 800 }}
            />
          )}

          {selectedBrands.map((b) => (
            <Chip
              key={`b-${b}`}
              size="small"
              label={b}
              onDelete={() =>
                dispatch(setSelectedBrands(selectedBrands.filter((x) => x !== b)))
              }
              sx={{ fontWeight: 800 }}
            />
          ))}

          {selectedTypes.map((t) => (
            <Chip
              key={`t-${t}`}
              size="small"
              label={t}
              onDelete={() =>
                dispatch(setSelectedTypes(selectedTypes.filter((x) => x !== t)))
              }
              sx={{ fontWeight: 800 }}
            />
          ))}
        </Stack>
      </Box>
      <Drawer
  anchor="bottom"
  open={open}
  onClose={closeFilters}
  PaperProps={{
    sx: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: "78vh",
    },
  }}
>
  <Box sx={{ px: 2, pt: 1.25, pb: 2 }}>
    {/* Header + Actions */}
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 1 }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 900 }}>
        Filters
      </Typography>

      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="text"
          onClick={clearAll}
          sx={{
            textTransform: "none",
            fontWeight: 800,
            color: "text.secondary",
          }}
        >
          Clear
        </Button>

        <Button
          size="small"
          variant="contained"
          onClick={applyFilters}
          sx={{
            textTransform: "none",
            fontWeight: 900,
            borderRadius: 2,
            bgcolor: "#ef4444",
            "&:hover": { bgcolor: "#dc2626" },
          }}
        >
          Apply
        </Button>

        <IconButton onClick={closeFilters}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </Stack>

    <Divider sx={{ mb: 1.5 }} />

    {/* Brands */}
    <Typography sx={{ fontWeight: 900, mb: 1 }}>Brands</Typography>
    <Box sx={{ display: "grid", gap: 1, mb: 2 }}>
      {isLoadingFilters ? (
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
          Loading brands…
        </Typography>
      ) : (
        (filtersData?.brands ?? []).map((b) => {
          const checked = draft.brands.includes(b.name);
          return (
            <Box
              key={b.name}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                px: 1.25,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: checked ? "grey.50" : "#fff",
              }}
            >
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={() =>
                      setDraft((d) => ({
                        ...d,
                        brands: toggleInList(d.brands, b.name),
                      }))
                    }
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 800 }}>
                    {b.name}
                  </Typography>
                }
              />
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {b.count}
              </Typography>
            </Box>
          );
        })
      )}
    </Box>

    {/* Types */}
    <Typography sx={{ fontWeight: 900, mb: 1 }}>Types</Typography>
    <Box sx={{ display: "grid", gap: 1 }}>
      {isLoadingFilters ? (
        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
          Loading types…
        </Typography>
      ) : (
        (filtersData?.types ?? []).map((t) => {
          const checked = draft.types.includes(t.name);
          return (
            <Box
              key={t.name}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                px: 1.25,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: checked ? "grey.50" : "#fff",
              }}
            >
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={() =>
                      setDraft((d) => ({
                        ...d,
                        types: toggleInList(d.types, t.name),
                      }))
                    }
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 800 }}>
                    {t.name}
                  </Typography>
                }
              />
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {t.count}
              </Typography>
            </Box>
          );
        })
      )}
    </Box>
  </Box>
</Drawer>

    </>
  );
}
