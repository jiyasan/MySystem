package com.example.app.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NullSafeList {

    private static final Logger log = LoggerFactory.getLogger(NullSafeList.class);

    // 通常版（読み取り専用）
    public static <T> List<T> of(List<T> list) {
        return (list != null) ? list : Collections.emptyList();
    }

    // ログ付き（読み取り専用）
    public static <T> List<T> ofWithLog(List<T> list, String listName) {
        if (list == null) {
            log.warn("📭 [{}] was null → emptyList() に変換", listName);
            return Collections.emptyList();
        }
        return list;
    }

    // 編集可能な空リスト版（使いどころ注意）
    public static <T> List<T> editable(List<T> list) {
        return (list != null) ? list : new ArrayList<>();
    }

    // 編集可能 + ログ付き
    public static <T> List<T> editableWithLog(List<T> list, String listName) {
        if (list == null) {
            log.warn("📭 [{}] was null → new ArrayList<>() に変換", listName);
            return new ArrayList<>();
        }
        return list;
    }
}
