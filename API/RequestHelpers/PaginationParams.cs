using System;

namespace API.RequestHelpers;

public class PaginationParams
{
    private const int MaxPageSize = 50;
    private int _pageNumber = 1;
    public int PageNumber
    {
        get => _pageNumber;
        set => _pageNumber = value < 1 ? 1 : value;
    }


    private int _pageSize = 8;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }

}
